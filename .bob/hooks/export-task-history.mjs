#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';

/**
 * IBM Bob Lifecycle Hook: Export Task to task-history
 *
 * Registered on the 'Stop' event in .bob/settings.json (exports the current task).
 * On 'SessionStart' it exports the previous task instead. Manual use, from the
 * workspace root: node .bob/hooks/export-task-history.mjs [taskId]
 * Reads task details from IBM Bob storage (~/.bob/db/bob.db via python3, or legacy
 * globalStorage) and exports them into:
 *   task-history/<NUMBER>_<NAME_FOR_THE_TASK>/
 * formatted with:
 *   - bob-task-<id>-<YYYY-MM-DD>.json
 *   - ui_messages.json
 *   - api_conversation_history.json
 */

// 1. Read input payload from stdin if available (with timeout to avoid hanging)
let rawInput = '';
if (!process.stdin.isTTY) {
  try {
    await new Promise((resolve) => {
      const timeout = setTimeout(() => {
        process.stdin.destroy();
        resolve();
      }, 500);
      let buf = '';
      process.stdin.setEncoding('utf8');
      process.stdin.on('data', chunk => { buf += chunk; });
      process.stdin.on('end', () => {
        clearTimeout(timeout);
        rawInput = buf;
        resolve();
      });
      process.stdin.on('error', () => { clearTimeout(timeout); resolve(); });
    });
  } catch (err) {
    // Ignore stdin read errors
  }
}

let eventData = {};
try {
  if (rawInput.trim()) {
    eventData = JSON.parse(rawInput);
  }
} catch (e) {
  // Not valid JSON or empty
}

const workspaceRoot = eventData.cwd || process.cwd();
const isSessionStart = eventData.hook_event_name === 'SessionStart';
const excludeSessionId = isSessionStart ? eventData.session_id || '' : '';
let sessionId = isSessionStart ? '' : eventData.session_id || process.argv[2] || '';

// 2. Discover SQLite database path (~/.bob/db/bob.db)
function getBobDbPath() {
  const primaryDb = path.join(os.homedir(), '.bob', 'db', 'bob.db');
  if (fs.existsSync(primaryDb)) return primaryDb;
  return null;
}

// 3. Query task and messages from SQLite ~/.bob/db/bob.db
function getTaskDataFromSqlite(targetSessionId, workspace, excludeId) {
  const dbPath = getBobDbPath();
  if (!dbPath) return null;

  try {
    const pythonScript = `
import sqlite3, json, sys, os

db_path = sys.argv[1]
target_id = sys.argv[2]
workspace = sys.argv[3]
exclude_id = sys.argv[4]

conn = sqlite3.connect(f"file:{db_path}?mode=ro", uri=True)
conn.row_factory = sqlite3.Row

task_row = None
if target_id:
    task_row = conn.execute("SELECT * FROM tasks WHERE id = ?", (target_id,)).fetchone()

if not task_row:
    ws_uri = f"file:{workspace}" if not workspace.startswith("file:") else workspace
    ws_raw = workspace.replace("file:", "")
    
    query = """
    SELECT * FROM tasks 
    WHERE (project_id = ? OR project_id = ? OR project_id LIKE ?)
    """
    params = [ws_uri, ws_raw, f"%{os.path.basename(workspace)}%"]
    if exclude_id:
        query += " AND id != ?"
        params.append(exclude_id)
    query += " ORDER BY created_at DESC LIMIT 1"
    task_row = conn.execute(query, params).fetchone()

if not task_row:
    sys.exit(0)

task_dict = dict(task_row)
msg_rows = conn.execute("SELECT * FROM messages WHERE task_id = ? ORDER BY created_at ASC", (task_dict["id"],)).fetchall()
messages = [dict(m) for m in msg_rows]

output = {
    "task": task_dict,
    "messages": messages
}
print(json.dumps(output))
`;
    const proc = spawnSync('python3', ['-c', pythonScript, dbPath, targetSessionId, workspace, excludeId], {
      encoding: 'utf8',
      maxBuffer: 50 * 1024 * 1024
    });

    if (proc.status === 0 && proc.stdout?.trim()) {
      return JSON.parse(proc.stdout.trim());
    }
  } catch (e) {
    // SQLite extraction failed, fallback to file search
  }
  return null;
}

// 4. Legacy file-based discovery (fallback for older Bob versions)
function getCandidateStorageDirs() {
  const home = os.homedir();
  const platform = process.platform;
  const candidates = [];

  if (platform === 'darwin') {
    candidates.push(
      path.join(home, 'Library/Application Support/IBM Bob/User/globalStorage'),
      path.join(home, 'Library/Application Support/IBM Bob - Insiders/User/globalStorage'),
      path.join(home, 'Library/Application Support/Code/User/globalStorage')
    );
  } else if (platform === 'win32') {
    const appData = process.env.APPDATA || path.join(home, 'AppData', 'Roaming');
    candidates.push(
      path.join(appData, 'IBM Bob/User/globalStorage'),
      path.join(appData, 'IBM Bob - Insiders/User/globalStorage'),
      path.join(appData, 'Code/User/globalStorage')
    );
  } else {
    candidates.push(
      path.join(home, '.config/IBM Bob/User/globalStorage'),
      path.join(home, '.config/IBM Bob - Insiders/User/globalStorage'),
      path.join(home, '.config/Code/User/globalStorage')
    );
  }

  return candidates.filter(dir => fs.existsSync(dir));
}

function findTaskDataLegacy(targetSessionId, excludeId = '') {
  const storageDirs = getCandidateStorageDirs();

  for (const storageDir of storageDirs) {
    const bobCodeDir = path.join(storageDir, 'ibm.bob-code');
    const tasksBaseDir = path.join(bobCodeDir, 'tasks');
    const dbPath = path.join(storageDir, 'state.vscdb');

    if (!fs.existsSync(tasksBaseDir)) continue;

    let targetDir = '';
    if (targetSessionId && fs.existsSync(path.join(tasksBaseDir, targetSessionId))) {
      targetDir = path.join(tasksBaseDir, targetSessionId);
    } else if (!targetSessionId) {
      const taskFolders = fs.readdirSync(tasksBaseDir)
        .map(f => ({ name: f, fullPath: path.join(tasksBaseDir, f) }))
        .filter(item => item.name !== excludeId && fs.statSync(item.fullPath).isDirectory())
        .sort((a, b) => fs.statSync(b.fullPath).mtimeMs - fs.statSync(a.fullPath).mtimeMs);

      if (taskFolders.length > 0) {
        targetDir = taskFolders[0].fullPath;
        targetSessionId = taskFolders[0].name;
      }
    }

    if (targetDir && fs.existsSync(targetDir)) {
      return {
        sessionId: targetSessionId,
        taskDir: targetDir,
        dbPath: fs.existsSync(dbPath) ? dbPath : null,
        storageDir
      };
    }
  }

  return null;
}

// Slugs that carry no meaning; a folder with such a name may be renamed later
const GENERIC_SLUGS = new Set(['unnamed_task', 'task', 'new_task', 'untitled']);

// 5. Clean task title and create a URL/folder-friendly slug
function slugify(text) {
  if (!text) return 'unnamed_task';
  
  let cleaned = text
    .replace(/<task>|<\/task>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/^[/#]\s*/g, '')
    .split('\n')[0]
    .trim();

  cleaned = cleaned
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

  if (cleaned.length > 50) {
    cleaned = cleaned.substring(0, 50).replace(/_+$/, '');
  }

  return cleaned || 'task';
}

async function exportTask() {
  let activeSessionId = sessionId;
  let rawTitle = '';
  let createdAt = Date.now();
  let updatedAt = Date.now();
  let taskEnv = { id: activeSessionId, workspace: workspaceRoot, language: 'en', modeId: 'agent' };
  let taskCosts = { totalCost: 0, tokensIn: 0, tokensOut: 0, cacheWrites: 0, cacheReads: 0 };
  let exportMessages = [];
  let uiMessages = [];
  let apiConversationHistory = [];

  // Try SQLite database first (~/.bob/db/bob.db)
  const sqliteData = getTaskDataFromSqlite(sessionId, workspaceRoot, excludeSessionId);

  if (sqliteData && sqliteData.task) {
    const t = sqliteData.task;
    activeSessionId = t.id;
    rawTitle = t.title || t.first_message || '';
    createdAt = t.created_at || Date.now();
    updatedAt = t.updated_at || Date.now();

    try {
      if (t.env) taskEnv = typeof t.env === 'string' ? JSON.parse(t.env) : t.env;
    } catch (e) {}

    try {
      if (t.costs) {
        const c = typeof t.costs === 'string' ? JSON.parse(t.costs) : t.costs;
        taskCosts = {
          totalCost: c.cost || c.totalCost || 0,
          tokensIn: c.tokensIn || c.contextTokens || 0,
          tokensOut: c.tokensOut || 0,
          cacheWrites: c.cacheWrites || 0,
          cacheReads: c.cacheReads || 0
        };
      }
    } catch (e) {}

    if (Array.isArray(sqliteData.messages)) {
      exportMessages = sqliteData.messages.map((m, idx) => {
        let parsedData = {};
        try {
          parsedData = typeof m.data === 'string' ? JSON.parse(m.data) : m.data;
        } catch (e) {
          parsedData = { role: m.role, content: m.data };
        }

        apiConversationHistory.push({
          role: m.role,
          content: parsedData.content ?? parsedData,
          ts: m.created_at
        });

        uiMessages.push({
          id: m.id || `${activeSessionId}-${idx}`,
          type: m.role === 'user' ? 'ask' : 'say',
          say: m.role === 'user' ? 'user_feedback' : 'text',
          text: typeof parsedData.content === 'string' ? parsedData.content : JSON.stringify(parsedData.content || ''),
          ts: m.created_at
        });

        return {
          id: m.id || `${activeSessionId}-${idx}`,
          role: m.role,
          data: parsedData,
          createdAt: m.created_at || createdAt
        };
      });
    }
  } else {
    // Fallback to legacy file-based task discovery
    const taskData = findTaskDataLegacy(sessionId, excludeSessionId);
    if (!taskData) {
      console.error(`[export-task-history] No task found to export (sessionId: "${sessionId}", excluded: "${excludeSessionId}")`);
      return;
    }

    activeSessionId = taskData.sessionId;
    const uiMessagesPath = path.join(taskData.taskDir, 'ui_messages.json');
    const apiConvPath = path.join(taskData.taskDir, 'api_conversation_history.json');

    if (fs.existsSync(uiMessagesPath)) {
      try { uiMessages = JSON.parse(fs.readFileSync(uiMessagesPath, 'utf8')); } catch (e) {}
    }
    if (fs.existsSync(apiConvPath)) {
      try { apiConversationHistory = JSON.parse(fs.readFileSync(apiConvPath, 'utf8')); } catch (e) {}
    }

    const firstSay = uiMessages.find(m => m.say === 'text' || m.type === 'say');
    if (firstSay && firstSay.text) {
      rawTitle = firstSay.text;
    } else if (apiConversationHistory.length > 0) {
      const firstUser = apiConversationHistory.find(m => m.role === 'user');
      if (firstUser) {
        rawTitle = typeof firstUser.content === 'string' ? firstUser.content : JSON.stringify(firstUser.content);
      }
    }

    exportMessages = apiConversationHistory.map((msg, idx) => ({
      id: `${activeSessionId}-${idx}`,
      role: msg.role,
      data: { role: msg.role, content: msg.content },
      createdAt: msg.ts || createdAt
    }));
  }

  const taskSlug = slugify(rawTitle);
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];

  // Target task-history folder at the workspace root
  const targetHistoryBase = path.join(workspaceRoot, 'task-history');
  fs.mkdirSync(targetHistoryBase, { recursive: true });

  // Find existing folders to determine numbering or identify existing export
  const existingEntries = fs.readdirSync(targetHistoryBase, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  // Check if this session was already exported to an existing folder
  let targetFolderName = '';
  for (const folder of existingEntries) {
    const fullFolderPath = path.join(targetHistoryBase, folder);
    const files = fs.readdirSync(fullFolderPath);
    const matchesSession = files.some(f => f.includes(activeSessionId));
    if (matchesSession) {
      targetFolderName = folder;
      break;
    }
  }

  if (!targetFolderName) {
    let maxNumber = 0;
    for (const folder of existingEntries) {
      const match = folder.match(/^(\d+)[-_]/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNumber) maxNumber = num;
      }
    }
    const nextNumber = String(maxNumber + 1).padStart(2, '0');
    targetFolderName = `${nextNumber}_${taskSlug}`;
  } else if (!GENERIC_SLUGS.has(taskSlug)) {
    // Existing export: keep the number, but rename the folder when the task
    // title became meaningful or changed (e.g. "01_unnamed_task" -> "01_my_title").
    const numMatch = targetFolderName.match(/^(\d+)[-_](.*)$/);
    const currentSlug = numMatch ? numMatch[2] : targetFolderName;
    if (currentSlug !== taskSlug) {
      const newName = `${numMatch ? numMatch[1] : String(existingEntries.length + 1).padStart(2, '0')}_${taskSlug}`;
      if (newName !== targetFolderName && !existingEntries.includes(newName)) {
        fs.renameSync(path.join(targetHistoryBase, targetFolderName), path.join(targetHistoryBase, newName));
        console.log(`[export-task-history] Renamed task-history/${targetFolderName} -> task-history/${newName}`);
        targetFolderName = newName;
      }
    }
  }

  const exportFolder = path.join(targetHistoryBase, targetFolderName);
  fs.mkdirSync(exportFolder, { recursive: true });

  // Remove stale exports of this session from earlier days (name contains a date)
  for (const f of fs.readdirSync(exportFolder)) {
    if (f.startsWith(`bob-task-${activeSessionId}-`) && f.endsWith('.json')) {
      fs.unlinkSync(path.join(exportFolder, f));
    }
  }

  const exportPayload = {
    version: 1,
    exportedAt: Date.now(),
    workspace: `file:${workspaceRoot}`,
    tasks: [
      {
        task: {
          id: activeSessionId,
          workspace: `file:${workspaceRoot}`,
          parentId: null,
          taskType: 'normal',
          title: rawTitle.split('\n')[0].trim() || taskSlug,
          status: 'completed',
          firstMessage: rawTitle,
          version: null,
          gitSha: null,
          gitBranch: null,
          env: taskEnv,
          costs: taskCosts,
          createdAt: createdAt,
          updatedAt: updatedAt
        },
        messages: exportMessages
      }
    ]
  };

  const exportJsonName = `bob-task-${activeSessionId}-${dateStr}.json`;
  const exportJsonPath = path.join(exportFolder, exportJsonName);

  fs.writeFileSync(exportJsonPath, JSON.stringify(exportPayload, null, 2), 'utf8');

  if (uiMessages.length > 0) {
    fs.writeFileSync(path.join(exportFolder, 'ui_messages.json'), JSON.stringify(uiMessages, null, 2), 'utf8');
  }
  if (apiConversationHistory.length > 0) {
    fs.writeFileSync(path.join(exportFolder, 'api_conversation_history.json'), JSON.stringify(apiConversationHistory, null, 2), 'utf8');
  }

  console.log(`[export-task-history] Exported task "${rawTitle.substring(0, 40)}" (${activeSessionId}) to:`);
  console.log(`  task-history/${targetFolderName}/${exportJsonName}`);
}

exportTask().catch(err => {
  console.error('[export-task-history] Export error:', err.message);
  process.exit(0);
});
