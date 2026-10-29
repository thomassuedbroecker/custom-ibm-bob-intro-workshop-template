# IBM Bob Hands-On Workshop: Template Repository

> Starter template for the **IBM Bob Introduction & Core Functionalities Workshop**, a 3-hour hands-on session.

This repository is your workspace for the workshop. It contains the lab guides, Bob workspace settings, a lifecycle hook, and an example skill. It starts with **no application code**: you build it with Bob during the labs.

---

## 💡 IBM Bob Trial Period & Access

> **🎉 Free Trial Available:**
> A **trial period is available for IBM Bob** allowing you to explore the Bob IDE, agentic workflows, custom modes, and the Bob Shell CLI before committing to an enterprise tier.
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

## 🛠️ Prerequisites

1. **IBM Bob IDE**. The workshop was written for **Bob 2.2.3**.
2. **Node.js** 18 or newer (LTS recommended) with `npm`.
3. **Git**, installed and configured:
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "you@example.com"
   ```
4. **Python 3** (`python3` on the `PATH`). The task-history hook uses it to read Bob's task database.
5. *(Optional)* **GitHub CLI (`gh`)** for creating pull requests in Lab 2.

---

## 🚀 Getting Started

**Attendees**

1. Click **"Use this template"** on GitHub, or fork or clone this repository.
2. Open the folder in **IBM Bob IDE**.
3. When prompted, choose **"Trust Workspace & Authors"**. Without trust, Bob does not run the hooks.
4. Open the [Workshop Lab Index](workshop-documentation/README.md) and start with Lab 1. Type the prompts from each lab into the Bob chat window.

**Instructors**

* Hand out this repository as the starting point for all attendees.
* Adapt the lab guides in [`workshop-documentation/`](workshop-documentation/) and the Bob configuration in [`.bob/`](.bob/) to fit your session.

---

## 📚 Labs

| Lab | Topic | Time |
| :--- | :--- | :--- |
| [Lab 1](workshop-documentation/lab-1-context-exploration.md) | Workspace Setup & Context Exploration | 30 min |
| [Lab 2](workshop-documentation/lab-2-git-workflows.md) | Agentic Git & GitHub Workflows | 30 min |
| [Lab 3](workshop-documentation/lab-3-resilient-microservice.md) | Building a Resilient Microservice | 45 min |
| [Lab 4](workshop-documentation/lab-4-mcp-integration.md) | Extending Bob with MCP Servers | 45 min |
| [Lab 5](workshop-documentation/lab-5-bob-plus-and-modes.md) | Bob+ Extension, Building Blocks & Custom Modes | 20 min |
| [Lab 6 (Bonus)](workshop-documentation/lab-6-future-steps-enterprise-integrations.md) | Future Steps: Bob CLI, Premium Packages & Enterprise Integrations | optional, 30 min |

---

## 📁 Repository Layout

```text
custom-ibm-bob-intro-workshop-template/
├── .bob/                       # Bob configuration
│   ├── hooks/
│   │   └── export-task-history.mjs   # Exports task history (see below)
│   ├── skills/
│   │   └── ai-regulatory-compliance/ # Example custom skill
│   ├── mcp.json                # MCP servers. You create it in Lab 4
│   └── settings.json           # Workspace settings and hook definitions
├── workshop-documentation/     # Lab guides (Labs 1–6) and lab index
├── workshop-apps/              # Your lab code, one folder per lab
├── workshop-git/               # Lab 2 Git/PR artifacts (PR description, workflow log)
├── task-history/               # Exported Bob task sessions
├── .bobignore                  # Paths Bob must not read or write (Lab 1, Step 1.1b)
├── .gitignore
├── AGENTS.md                   # Workspace rules, loaded automatically by Bob
├── LICENSE                     # Apache 2.0
├── NOTICE                      # Copyright and third-party notice
└── README.md                   # This page
```

---

## 🧩 Preinstalled Example Assets

### Custom skill: `ai-regulatory-compliance`

Creates AI regulatory compliance provenance documentation from exported task sessions. You run it in the optional [Lab 6, Step 6.5](workshop-documentation/lab-6-future-steps-enterprise-integrations.md). `task-history/` is listed in [`.bobignore`](.bobignore), so the lab temporarily makes it readable for Bob. It is located in [`.bob/skills/ai-regulatory-compliance/`](.bob/skills/ai-regulatory-compliance/SKILL.md) and comes from the [review_and_sdd_custom_ibm_bob_configuration_template](https://github.com/thomassuedbroecker/review_and_sdd_custom_ibm_bob_configuration_template) repository.

### Lifecycle hook: `export-task-history`

At the end of every task turn (the `Stop` event), the hook saves the current Bob task to `task-history/<NN>_<task_name>/`, for example `task-history/01_build_rest_api/`. Later turns of the same task update the same folder, so no duplicates are created.

* **Requires a trusted workspace.** In an untrusted workspace, Bob suppresses hooks. To change trust later, run `Workspaces: Manage Workspace Trust` from the Command Palette.
* **Export manually** from the repository root:
  ```bash
  node .bob/hooks/export-task-history.mjs            # most recent task
  node .bob/hooks/export-task-history.mjs <task-id>  # a specific task
  ```
* **Turn it on or off** in [`.bob/settings.json`](.bob/settings.json). The `Stop` entry turns it on. To turn it off, remove that entry or set `"hooks": {}`.

---

## 📄 Open Source License & Code Terms

This workshop template, its accompanying documentation, configuration files, lifecycle scripts, custom skills, and all example application code scaffolded during the workshop are licensed under the **[Apache License, Version 2.0](LICENSE)**.

- Full license text: [`LICENSE`](LICENSE). Copyright notice: [`NOTICE`](NOTICE).
- You are free to use, modify, redistribute, and adapt this material for your own training and development workflows under the terms of the Apache 2.0 license.

### Third-party components and references

This repository does not bundle third-party source code, except the skill listed first. The other components are referenced in the labs and are installed or downloaded by you, under their own licenses. Licenses were checked against the upstream repositories and package registries. Check them again before you redistribute.

| Component | Where it appears | License | Source |
| :--- | :--- | :--- | :--- |
| `ai-regulatory-compliance` skill | Bundled in [`.bob/skills/`](.bob/skills/ai-regulatory-compliance/SKILL.md) | Apache-2.0 | [review_and_sdd_custom_ibm_bob_configuration_template](https://github.com/thomassuedbroecker/review_and_sdd_custom_ibm_bob_configuration_template) |
| Custom modes template (`custom_modes.yaml`) | Lab 5, optional download | Apache-2.0 | same repository as above |
| Galaxium Travels infrastructure sample | Lab 5, reference link only | Apache-2.0 | [galaxium-travels-infrastructure-tsuedbro](https://github.com/thomassuedbroecker/galaxium-travels-infrastructure-tsuedbro) |
| Bob+ extension (`.vsix`), skills and modes | Lab 5, you download it | Apache-2.0 (repository license) | [ibm-self-serve-assets/building-blocks](https://github.com/ibm-self-serve-assets/building-blocks) |
| Express | Lab 3, installed with `npm install` | MIT | [npm: express](https://www.npmjs.com/package/express) |
| `mcp-server-sqlite` | Lab 4, started with `uvx` | MIT (repository license; the PyPI metadata has no license field) | [PyPI](https://pypi.org/project/mcp-server-sqlite/), [source (archived)](https://github.com/modelcontextprotocol/servers-archived/tree/main/src/sqlite) |
| `mcp` Python library | Lab 4, pulled in by `uvx --with "mcp<2"` | MIT | [PyPI: mcp](https://pypi.org/project/mcp/) |
| `uv` | Lab 4 prerequisite | MIT OR Apache-2.0 | [docs.astral.sh/uv](https://docs.astral.sh/uv/) |
| TM1py | Lab 6, mentioned only | MIT | [cubewise-code/tm1py](https://github.com/cubewise-code/tm1py) |

**IBM Bob, Bob Shell and the Bob documentation are IBM products and content.** They are not covered by the Apache 2.0 license of this repository. Their use is governed by the IBM Bob license agreement that you accept on first use. Product names and links point to the official IBM documentation. The EU AI Act and GDPR texts referenced by the skill are published by the European Union (EUR-Lex). The skill and its output are not legal advice.
