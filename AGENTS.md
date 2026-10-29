# AGENTS.md

This file provides guidance to agents when working with code in this repository.

- **Workshop Context:** This repository is a starter template for the **IBM Bob 3-Hour Hands-On Workshop**.
- **Lab Documentation:** All workshop guides are located under `workshop-documentation/` (`lab-1` through `lab-6`).
- **Starter Workspace:** The repository begins with no pre-packaged source code. When attendees work through Labs 1–3, assist them in scaffolding lightweight, clean Node.js / Express code conforming to the lab instructions.
- **Generated Applications (mandatory):** Never create lab code in the repository root. Put each lab's application in its own folder under `workshop-apps/`: `lab-1-calculator/`, `lab-2-git-demo/`, `lab-3-resilient-service/`, `lab-4-mcp/`. Apps with dependencies (Lab 3) get their own `package.json`; run `npm`, `node` and `curl` commands with the lab folder as `cwd`.
- **Git / PR Artifacts (mandatory):** Files produced by the Git and pull request workflow (PR description, workflow log) go to `workshop-git/lab-2-pr/`, never to the root. When committing, stage explicit paths only (never `git add .` / `-A`), and never stage `task-history/`. Never force-push without the attendee's explicit approval. Never print or store GitHub tokens in files or chat.
- **MCP Servers:** Local and workshop MCP servers can be configured in `.bob/mcp.json` during Lab 4. The template does not ship this file. It can hold tokens, so never commit a token in it.
- **SQLite MCP Server (Lab 4):** The database file lives in `workshop-apps/lab-4-mcp/workshop.db` (absolute path in `.bob/mcp.json`). Use the MCP tools of `workshop-db` (`create_table`, `write_query`, `read_query`) for database work, not the terminal or `sqlite3`. The server is `mcp-server-sqlite`, run with `uvx --with "mcp<2" mcp-server-sqlite --db-path <path>`. The npm package `@modelcontextprotocol/server-sqlite` does not exist.
- **Coding Style:** Keep code concise, readable, and properly documented with clickable file and line links.
- **Task History Export:** The `Stop` hook in [`.bob/settings.json`](.bob/settings.json) automatically exports task history to `task-history/<NN>_<task_name>/` when a task turn completes. Hooks do not run in untrusted workspaces; if needed, run `node .bob/hooks/export-task-history.mjs` manually (`execute_command`) to export the latest task to `task-history/<NN>_<task_name>/` at the workspace root. Do not write exports to any other folder.
