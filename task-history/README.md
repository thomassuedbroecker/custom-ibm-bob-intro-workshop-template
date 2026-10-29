# Task History (`task-history/`)

This directory serves as the storage location for exported **IBM Bob task session histories**. It provides a structured audit trail and provenance record of AI-assisted development sessions conducted within the workspace.

---

## 📌 Purpose & Overview

When working with AI coding assistants, maintaining traceability of prompts, tool invocations, code modifications, and human oversight is essential for compliance, reproducibility, and knowledge sharing.

The `task-history/` folder stores:
* **Session Metadata:** Task ID, title, timestamp, token usage, and cost estimates.
* **Conversation History:** Full record of user prompts and AI responses.
* **Tool & Command Invocations:** Detailed traces of file edits, symbol queries, and commands executed during the session.

---

## 📁 Directory Structure & Export Format

Task sessions are organized sequentially into numbered subdirectories representing each completed task:

```text
task-history/
├── README.md                                   # This documentation file
└── <NUMBER>_<TASK_NAME>/                       # e.g., 01_build_rest_api/
    ├── bob-task-<session_id>-<YYYY-MM-DD>.json # Consolidated task session payload & metadata
    ├── ui_messages.json                        # Raw UI chat events and interaction stream
    └── api_conversation_history.json           # API prompt and response message exchanges
```

### File Breakdown

| File | Description |
| :--- | :--- |
| `bob-task-<id>-<date>.json` | Structured export payload including session duration, token counts, cost breakdown, environment mode, and all messages. |
| `ui_messages.json` | Complete stream of UI interaction messages and chat events. |
| `api_conversation_history.json` | Exact conversation exchange (roles: `user`, `assistant`, tool calls) sent to the LLM backend. |

---

## ⚙️ Automatic Export via Lifecycle Hook

Task sessions can be exported automatically by the lifecycle hook [`.bob/hooks/export-task-history.mjs`](../.bob/hooks/export-task-history.mjs:1). The hook must be enabled first (see [Lifecycle hook: `export-task-history`](../README.md#lifecycle-hook-export-task-history)).

* **Trigger:** The Bob `Stop` event, i.e. at the end of every task turn. Later turns of the same task update the same folder.
* **Configuration:** Defined in [`.bob/settings.json`](../.bob/settings.json:1). Hooks only run in a trusted workspace.
* **Folder name:** Taken from the task title, or from your first prompt if there is no title (max. 50 characters, lowercase, `_` instead of spaces).
* **Data source:** Bob's task database `~/.bob/db/bob.db`, read with `python3`. Older Bob versions without that database fall back to the IDE's `globalStorage` folder.
* **Manual Execution:** Run the hook from the repository root. Optionally pass a task ID as the first argument:
  ```bash
  node .bob/hooks/export-task-history.mjs
  ```

> `ui_messages.json` and `api_conversation_history.json` are only written when the task has messages.
>
> This folder is listed in [`.bobignore`](../.bobignore), so Bob itself cannot read the exports. Do not commit the exports in the workshop (see [Lab 2](../workshop-documentation/lab-2-git-workflows.md)).

---

## ⚖️ AI Regulatory Compliance Integration

Exported sessions in this folder provide the primary evidence base for the [**AI Regulatory Compliance Skill**](../.bob/skills/ai-regulatory-compliance/SKILL.md:1) preinstalled in [`.bob/skills/ai-regulatory-compliance/`](../.bob/skills/ai-regulatory-compliance/SKILL.md:1).

The skill analyzes the task history records to generate **AI Regulatory Compliance Provenance Documents** satisfying:
* **EU AI Act (Regulation (EU) 2024/1689):** Articles 13 (Transparency), 14 (Human Oversight), 16 (Obligations of Providers), and 50 (Transparency for Providers/Deployers).
* **GDPR (Regulation (EU) 2016/679):** Articles 5 (Data Processing Principles), 22 (Automated Decision-Making), and 25 (Data Protection by Design).
