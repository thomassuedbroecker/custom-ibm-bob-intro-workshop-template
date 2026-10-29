# Workshop Apps (`workshop-apps/`)

All code you generate with Bob during the labs lives here, **one folder per lab**. Nothing is generated in the repository root.

```text
workshop-apps/
├── README.md                  # This file (part of the template)
├── lab-1-calculator/          # Lab 1: calculator.js, app.js
├── lab-2-git-demo/            # Lab 2: validator.js (the code that goes into the PR)
├── lab-3-resilient-service/   # Lab 3: Express microservice (index.js, package.json, data/, test/)
└── lab-4-mcp/                 # Lab 4: workshop.db, the data file of the SQLite MCP server (mcp-server-sqlite)
```

## Rules
- Each lab has its own folder. Apps with dependencies (Lab 3) get their own `package.json`. Run `npm`, `node` and `curl` commands from inside the app folder.
- `node_modules/`, `.env` and `*.db` are ignored by Git.
- Only `lab-2-git-demo/` is committed in the Lab 2 pull request. See [Lab 2](../workshop-documentation/lab-2-git-workflows.md).
- Git/PR artifacts (PR description, workflow log) go to [`workshop-git/`](../workshop-git/README.md), not here.

## 📄 Open Source License
All sample code, modules, and microservices generated and used in `workshop-apps/` are licensed under the **[Apache License 2.0](../LICENSE)**.
