# IBM Bob Workshop: Hands-On Guide

Welcome to the **IBM Bob 3-Hour Hands-On Workshop**. This repository serves as both the attendee workbook and starter workspace template.

> **Target IBM Bob Version:** This workshop was authored with **IBM Bob 2.2.3**.

---

## 💡 IBM Bob Trial Period & Access

> **🎉 Free Trial Available:**
> A **trial period is available for IBM Bob** allowing attendees to explore the Bob IDE, agentic workflows, custom modes, and the Bob Shell CLI before committing to an enterprise tier.
> - Check your organization's access portal or visit [IBM Bob Documentation & Access](https://bob.ibm.com) to register or activate your trial account.
> - Ensure your trial seat is assigned and active prior to beginning the hands-on labs.

---

## ⚠️ Workshop Execution Costs & Resource Usage Notice

> **💳 Cost & Usage Advisory:**
> - Executing the prompts and agentic tasks in this workshop consumes AI foundation model tokens and API quota associated with your IBM Bob account.
> - When using trial seats or promotional credits, these activities draw down from your allotted trial allowance.
> - If you explore optional enterprise cloud integrations (such as IBM Cloud Code Engine deployments or watsonx Orchestrate endpoints in Labs 5 & 6), standard cloud infrastructure and API invocation charges may apply based on your cloud account's pricing plan.
> - Keep prompt iterations focused and follow the recommended lab steps to manage resource consumption effectively.

---

## 📚 IBM Bob Official Documentation References

| Lab | Covered Features | IBM Bob Documentation Reference |
| :--- | :--- | :--- |
| **Lab 1** | Workspace Rules (`AGENTS.md`), Context Indexing, Symbol Navigation | [Custom Rules & `AGENTS.md`](https://bob.ibm.com/docs/ide/configuration/rules) (`docs/ide/configuration/rules`), [Project Onboarding with `/init`](https://bob.ibm.com/docs/ide/tutorials/start-a-project) (`docs/ide/tutorials/start-a-project`), [Context Management](https://bob.ibm.com/docs/ide/core-concepts/context-window-management) (`docs/ide/core-concepts/context-window-management`) |
| **Lab 2** | Agentic Git, Semantic Commits, PR Drafting | [Version Control Best Practices](https://bob.ibm.com/docs/ide/getting-started/best-practices) (`docs/ide/getting-started/best-practices`), [Code Reviews (`/review`)](https://bob.ibm.com/docs/ide/features/code-reviews) (`docs/ide/features/code-reviews`) |
| **Lab 3** | App Scaffolding, Rate Limiting, Automated Testing (`node:test`) | [Application Modernization & Scaffolding](https://bob.ibm.com/docs/ide/tutorials/modernize-nodejs-express-api) (`docs/ide/tutorials/modernize-nodejs-express-api`), [Auto-approving Actions](https://bob.ibm.com/docs/ide/features/auto-approving-actions) (`docs/ide/features/auto-approving-actions`) |
| **Lab 4** | Model Context Protocol (MCP), SQLite, authenticated remote servers | [Using MCP in Bob](https://bob.ibm.com/docs/ide/configuration/mcp/mcp-in-bob) (`docs/ide/configuration/mcp/mcp-in-bob`), [Understanding MCP](https://bob.ibm.com/docs/ide/configuration/mcp/understanding-mcp) (`docs/ide/configuration/mcp/understanding-mcp`), [MCP Security Guidance](https://bob.ibm.com/docs/ide/security/bob-security-guidance) (`docs/ide/security/bob-security-guidance`) |
| **Lab 5** | Bob+ Extension, Building Blocks, Custom Modes (`custom_modes.yaml`) | [Custom Modes](https://bob.ibm.com/docs/ide/configuration/custom-modes) (`docs/ide/configuration/custom-modes`), [Standardize Bob's Behavior](https://bob.ibm.com/docs/ide/tutorials/standardize-bobs-behavior) (`docs/ide/tutorials/standardize-bobs-behavior`) |
| **Lab 6 (Bonus)** | Bob Shell CLI, Premium Packages, watsonx Orchestrate, Planning Analytics (TM1), compliance provenance with the `ai-regulatory-compliance` skill | [Bob Shell CLI](https://bob.ibm.com/docs/shell) (`docs/shell`), [Enterprise Premium Packages](https://bob.ibm.com/docs/ide/premium-packages/pkg-index) (`docs/ide/premium-packages/pkg-index`), [IBM watsonx Orchestrate](https://www.ibm.com/docs/en/watsonx/watson-orchestrate), [IBM Planning Analytics](https://www.ibm.com/docs/en/planning-analytics) |

---

## Workshop Schedule (180 Minutes)

| Lab | Title | Focus Area | Duration |
| :--- | :--- | :--- | :--- |
| **[Lab 1](lab-1-context-exploration.md)** | **Workspace Setup & Context Exploration** | Context awareness, symbol search, project rules (`AGENTS.md`) | **30 min** |
| **[Lab 2](lab-2-git-workflows.md)** | **Agentic Git & GitHub Workflows** | Issues, PRs, branch management, semantic commit generation | **30 min** |
| **[Lab 3](lab-3-resilient-microservice.md)** | **Building a Resilient Microservice** | Code scaffolding, rate limiting, testing, and debugging | **45 min** |
| **[Lab 4](lab-4-mcp-integration.md)** | **Extending Bob with MCP Servers** | Model Context Protocol, SQLite integration, authenticated remote servers | **45 min** |
| **[Lab 5](lab-5-bob-plus-and-modes.md)** | **Bob+ Extension & Building Blocks** | Bob+ skills & modes, custom modes, reusable templates | **20 min** |
| **[Lab 6](lab-6-future-steps-enterprise-integrations.md)** | **Future Steps & Enterprise Integrations** | Bob CLI, Premium Packages, watsonx Orchestrate, TM1, compliance provenance wrap-up | **Optional / 40 min** |
| **Wrap-up** | **Review & Next Steps** | Architecture review, team standards, Q&A | **10 min** |

---

## 🎯 Workshop Deliverables & Reachable Evidence

Every lab produces verifiable, concrete evidence to validate your progress and ensure compliance with workshop requirements:

| Lab | Verifiable Output & Evidence | Primary Evidence Location | Reachability Verification |
| :--- | :--- | :--- | :--- |
| **Lab 1** | Scaffolding utility module & AST symbol resolution test | `workshop-apps/lab-1-calculator/src/utils/calculator.js`, `src/app.js` | Chat symbol lookup returns clickable file & line references |
| **Lab 2** | Feature branch, explicit conventional commit, PR description & audit log | `workshop-apps/lab-2-git-demo/`, `workshop-git/lab-2-pr/pr-description.md`, `workshop-git/lab-2-pr/GIT-WORKFLOW-LOG.md` | `git log -1 --stat`, `gh pr status` or PR URL, verified workflow log |
| **Lab 3** | Express REST microservice, sliding rate limiter & automated tests | `workshop-apps/lab-3-resilient-service/index.js`, `package.json`, `data/sample.json`, `test/api.test.js` | Terminal `curl` returns HTTP 200/429; `npm test` passes cleanly |
| **Lab 4** | Local SQLite MCP server configuration & populated SQLite database | `.bob/mcp.json`, `workshop-apps/lab-4-mcp/workshop.db` | MCP tools `create_table`, `write_query`, `read_query` return DB results |
| **Lab 5** | Installed Bob+ extension, custom modes, and architecture review specs | `.bob/skills/`, `.bob/custom_modes.yaml`, mode switch outputs | Bob mode selector lists custom modes; prompt responses reflect mode persona |
| **Lab 6** | Headless CLI automation script, enterprise architecture integration design and AI regulatory compliance provenance document | Bob Shell CLI terminal session, watsonx/TM1 MCP configuration designs, `.bob/artifacts/<project-slug>-ai-regulatory-compliance.html` | `bob -p` execution, `/restore` checkpoint validation, HTML file opens in a browser |

---

## Where Do I Type This? (Chat vs. Terminal vs. Editor)

Every code block in the labs is introduced by a label that tells you where it goes. There are three places:

| Label | Where | What goes there |
| :--- | :--- | :--- |
| 💬 **Bob chat (agentic sidebar)** | The chat input of the Bob sidebar | Natural-language prompts for Bob (blocks marked `markdown`). Paste, press Enter. |
| 🖥️ **Terminal** | A terminal **you** open in the IDE | Shell commands such as `git`, `npm`, `node`, `curl`, `gh`, `uvx` (blocks marked `bash`). |
| 📝 **Editor** | A file you open and edit yourself | Configuration such as `.bob/mcp.json`. |

**Open a terminal:** in the Bob IDE use the menu **Terminal → New Terminal** (or the shortcut ``Ctrl+` ``, also on macOS). Check that you are in the repository root before you start (`pwd` shows the path ending in `custom-ibm-bob-intro-workshop-template` or your repository name). Labs that need a second terminal say so (for example Lab 3, where the server keeps running in Terminal 1).

> **⚠️ Do not paste shell commands into the Bob chat.** The chat treats every message as a task. In an earlier workshop run, commands such as `git status`, `npm install`, `node index.js &` and `gh pr create ...` were pasted into the chat. Bob then had to run them itself, through its own approval prompts, instead of you running them in your terminal. Use the chat for prompts and your own terminal for commands.
>
> The other direction fails too: pasting a chat prompt such as `Create a new branch ...` into a terminal only gives a shell error.

If a step says *"Bob runs the command"*, you do not type it. You ask in the chat, and Bob proposes the command in an approval prompt (see [Lab 1, Step 1.1b](lab-1-context-exploration.md)).

---

## Prerequisites & Workspace Setup

Before starting the workshop, ensure you have:
1. **IBM Bob IDE** installed and running. The workshop was authored with the version below:
   ```text
   Version: 1.126.0+bob2.2.3
   VSCode Version: 1.126.0
   Bob Version: 2.2.3
   Commit: 243e5e6d09f627d6dbf53f3351da0c5033c8fefa
   Date: 2026-10-14T12:48:38.743Z
   Electron: 42.2.0
   Chromium: 148.0.7778.97
   Node.js: 24.15.0
   V8: 14.8.178.14-electron.0
   OS: Darwin arm64 27.0.0
   ```
2. **Workspace Trust Enabled:** When opening this repository in IBM Bob, accept the prompt to **Trust Workspace & Authors** (or run `Workspaces: Manage Workspace Trust` from the Command Palette). Workspace Trust is required for lifecycle hooks (such as automatic task-history export in [`.bob/settings.json`](../.bob/settings.json:1)) and Bob extension features to run.
3. **Node.js** 18 or newer (LTS recommended) and `npm` installed locally.
4. **Python 3** (`python3` on the `PATH`). The task-history hook uses it to read Bob's task database.
5. **Git** configured with user email and name.
6. **GitHub CLI (`gh`)**, authenticated with `gh auth login` (recommended for Lab 2 PR creation; Lab 2 Step 2.0 describes fallbacks).
7. **`uv`** (provides `uvx`) for the Lab 4 SQLite MCP server. macOS: `brew install uv`.


---

## Platform Support

The workshop runs on **macOS, Windows, and Linux**. IBM Bob IDE and all required tools (Node.js, Git, `gh`) are available on all three platforms. The notes below cover the few platform-specific differences to be aware of.

### macOS
No additional setup required. The workshop was authored and tested on macOS (Darwin arm64). All shell commands use `bash`/`zsh` syntax, which works out of the box.

### Windows
- **Recommended:** Use **Git Bash**, **WSL 2 (Windows Subsystem for Linux)**, or the **Windows Terminal** with a bash-compatible shell. All `bash`-style shell commands in the labs work without modification in these environments.
- **Native PowerShell / `cmd.exe`:** Path separators and some shell syntax differ. Minor manual translation may be needed for the occasional `bash` snippet.
- Keyboard shortcuts throughout the labs that show `Cmd+…` (macOS) map to `Ctrl+…` on Windows (e.g. `Ctrl+Shift+P` for the Command Palette, `Ctrl+Shift+X` for the Extensions panel).

### Linux
- All shell commands use standard `bash` syntax and work without modification on any major distribution (Ubuntu, Debian, Fedora, etc.).
- Keyboard shortcuts that show `Cmd+…` (macOS) map to `Ctrl+…` on Linux.

---

## Repository Structure

```text
custom-ibm-bob-intro-workshop-template/
├── .bob/                               # Bob configuration (MCP servers, skills, hooks)
│   ├── hooks/                          # Lifecycle hook scripts
│   │   └── export-task-history.mjs     # Automatic task history export script
│   ├── skills/                         # Custom skills
│   │   └── ai-regulatory-compliance/   # AI Regulatory Compliance Provenance skill
│   │       ├── README.md
│   │       └── SKILL.md
│   ├── mcp.json                        # MCP server definitions (you create it in Lab 4)
│   └── settings.json                   # Bob workspace settings and hook definitions
├── task-history/                       # Task session histories & audit trail documentation
│   └── README.md
├── workshop-apps/                      # Code generated in the labs, one folder per lab
│   └── README.md                       # (lab-1-calculator, lab-2-git-demo, lab-3-resilient-service, lab-4-mcp)
├── workshop-git/                       # Git/PR artifacts of Lab 2 (pr-description.md, workflow log)
│   └── README.md
├── workshop-documentation/             # Hands-on lab documentation
│   ├── README.md                       # Workshop overview and navigation
│   ├── lab-1-context-exploration.md
│   ├── lab-2-git-workflows.md
│   ├── lab-3-resilient-microservice.md
│   ├── lab-4-mcp-integration.md
│   ├── lab-5-bob-plus-and-modes.md
│   └── lab-6-future-steps-enterprise-integrations.md
├── .bobignore                          # Paths Bob must not read/write (see Lab 1, Step 1.1b)
├── .gitignore                          # Standard git ignore definitions
├── AGENTS.md                           # Workspace rules and project context, loaded automatically by Bob
├── LICENSE                             # Apache 2.0 license
├── NOTICE                              # Copyright and third-party notice
└── README.md                           # Repository entrypoint
```

---

## 📄 Open Source License & Code Terms

This workshop template, its documentation, configuration files, lifecycle scripts, custom skills, and all example application code scaffolded during the workshop are licensed under the **[Apache License, Version 2.0](../LICENSE)**.

- Full license text: [`LICENSE`](../LICENSE). Copyright notice: [`NOTICE`](../NOTICE).
- You are free to use, modify, redistribute, and adapt this material for your own training and development workflows under the terms of the Apache 2.0 license.
