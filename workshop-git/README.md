# Workshop Git Artifacts (`workshop-git/`)

This folder holds files produced by the **Git and pull request workflow** in [Lab 2](../workshop-documentation/lab-2-git-workflows.md). It keeps these files out of the repository root and out of your pull request.

```text
workshop-git/
├── README.md                  # This file (part of the template)
└── lab-2-pr/                  # Created during Lab 2
    ├── pr-description.md      # PR body: Summary, Breaking Changes, Testing Checklist
    └── GIT-WORKFLOW-LOG.md    # Record: branch, commit, push result, PR URL, problems
```

## Rules
- Only Git/PR artifacts belong here. Application code goes to [`workshop-apps/`](../workshop-apps/).
- Files in `lab-2-pr/` are local artifacts. They are used as the PR body (`--body-file`) and are **not** committed to the feature branch.
- Never write tokens or secrets into these files.
- Bob task history exports stay in `task-history/` and are never staged.

## Workflow Overview

```mermaid
flowchart TD
    A["2.0 Check remote + gh / token"] --> B["2.1 Verify repo (no git init)"]
    B --> C["2.2 Branch feat/data-validator + code in workshop-apps/lab-2-git-demo"]
    C --> D["2.3 Stage explicit path + conventional commit"]
    D --> E["2.4 Push branch"]
    E --> F["2.5 pr-description.md in workshop-git/lab-2-pr"]
    F --> G{"2.6 Create PR"}
    G -->|"1"| H["gh pr create"]
    G -->|"2"| I["GitHub MCP"]
    G -->|"3"| J["Browser link"]
    H --> K["2.7 GIT-WORKFLOW-LOG.md + git switch main"]
    I --> K
    J --> K
```
