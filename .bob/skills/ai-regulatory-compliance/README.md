# Skill: `ai-regulatory-compliance`

> **For IT service consultants** — produces an auditor-ready AI Regulatory Compliance
> Provenance document for client projects that used AI-assisted development.

> **Scope: how the application was BUILT with AI — not how it operates with AI.**
> The document covers the AI coding assistant (e.g. IBM Bob), its sessions, permissions,
> the data it could access and the human review of its output. AI features that the built
> application uses at runtime (agents, LLM calls, categorisation, end-user disclosures)
> are **out of scope** and need a separate assessment. See *Scope* in `SKILL.md`.

---

## What this skill does

When activated, this skill guides Bob through a structured 6-step process that:

1. Verifies a `task-history/` folder of exported AI session files exists
2. Extracts structural metadata (session count, dates, file sizes) — **without reading any JSON content**
3. Interviews the consultant for project and client facts
4. Walks through a regulatory checklist covering **EU AI Act** and **GDPR** articles
5. Generates a self-contained **HTML provenance artifact** in `.bob/artifacts/`
6. Delivers a Markdown compliance summary with remediation actions for any gaps

---

## Regulations covered

### EU AI Act — Regulation (EU) 2024/1689

| Article | Official Title | Enforcement Date | Status |
|---|---|---|---|
| **Art. 50** | Transparency Obligations for Providers and Deployers of Certain AI Systems | 2 Aug 2026 — all AI tiers | 🔴 **Already in force** |
| **Art. 13** | Transparency and Provision of Information to Deployers | 2 Dec 2027 (Annex III) · 2 Aug 2028 (Annex I) | 🟡 Future obligation |
| **Art. 14** | Human Oversight | 2 Dec 2027 (Annex III) · 2 Aug 2028 (Annex I) | 🟡 Future obligation |
| **Art. 16** | Obligations of Providers of High-Risk AI Systems | 2 Dec 2027 (Annex III) · 2 Aug 2028 (Annex I) | 🟡 Future obligation |

> ⚠️ **Art. 50 is already legally binding** (since 2 August 2026). If the system interacts
> directly with end users, the disclosure obligation applies **today**.
>
> Art. 13, 14, and 16 are future obligations — but preparing compliance evidence **now**
> is the correct approach. Retroactive documentation of a completed project is far harder
> than maintaining the audit trail during development. The `task-history/` folder is exactly
> the kind of evidence Art. 13 will require.

Official text: <https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689>

### GDPR — Regulation (EU) 2016/679

| Article | Official Title | In Force |
|---|---|---|
| **Art. 5** | Principles relating to processing of personal data | 25 May 2018 |
| **Art. 22** | Automated individual decision-making, including profiling | 25 May 2018 |
| **Art. 25** | Data protection by design and by default | 25 May 2018 |

Official text: <https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32016R0679>

> GDPR articles are **conditionally applied** — if no personal data was processed by
> the AI tool, those checklist items are marked ✓ with the note
> *"No personal data processed — article not triggered."*

---

## Skill file location

```
.bob/skills/ai-regulatory-compliance/
├── SKILL.md          ← procedural instructions Bob follows (this is the skill)
├── README.md         ← this file
```

---

## How to activate

The skill auto-activates when you say something like:

- *"Generate the AI regulatory compliance document for this project"*
- *"Produce the EU AI Act provenance report"*
- *"Create the GDPR and AI Act compliance checklist for the client"*
- *"Run the ai-regulatory-compliance skill"*
- *"/ai-regulatory-compliance"*

---

## Prerequisites

Before running the skill, the following must be in place:

| Requirement | Details |
|---|---|
| `task-history/` folder | Must exist at the workspace root |
| Numbered sub-folders | Each named `<NN>_<title>/` (e.g. `01_init_setup/`) |
| JSON export per session | Each sub-folder contains one `bob-task-<id>-<YYYY-MM-DD>.json` |
| Consultant availability | The consultant must answer ~10 project/client questions interactively |

The skill **does not** require:
- Running tests or build tools
- Reading source code
- Opening any JSON file

---

## Workflow overview

```
Step 0  Verify task-history/ exists and has the correct structure
Step 1  Extract structural metadata from task-history/ (folder names, file sizes, dates)
Step 2  Interview the consultant for client/project facts (ask_followup_question)
Step 3  Walk the regulatory checklist — EU AI Act Art. 50 → 13 → 14 → 16 → GDPR Art. 5 → 22 → 25
Step 4  Define the provenance document structure (12 mandatory sections)
Step 5  Generate the HTML artifact → .bob/artifacts/<project-slug>-ai-regulatory-compliance.html
Step 6  Deliver a Markdown compliance summary with remediation actions
```

---

## Output artifact

A self-contained HTML file written to:

```
.bob/artifacts/<project-slug>-ai-regulatory-compliance.html
```

The document always contains these sections in order:

1. Header (badges, metadata grid)
2. Executive Summary
3. AI-Assisted Project Metrics
4. Built Application (Object of Development) — no runtime-AI description
5. AI Tool Provenance
6. Session Timeline
7. Regulatory Compliance Checklist (EU AI Act + GDPR)
8. Data Privacy & Ethical Use Statement
9. Limitations & Known Gaps
10. Remediation Actions
11. **Legal Reference Appendix** ← always present, verbatim from the skill
12. Footer (dynamic generation date, consultant placeholder, disclaimer)

---

## Checklist items at a glance

### EU AI Act Art. 50 (all AI tiers — earliest enforcement 2 Aug 2026)
- End users informed they interact with an AI system
- AI-generated content disclosed as AI-generated
- Deep-fake / synthetic media disclosures in place (if applicable)

### EU AI Act Art. 13 (high-risk systems)
- AI tool name and version documented
- Development / engagement period documented
- Intended purpose described
- Capabilities and limitations stated
- Data types processed described
- Session audit trail retained in `task-history/`

### EU AI Act Art. 14 (high-risk systems)
- Human oversight mode documented
- Review and approval process described
- Explicit statement: no AI output deployed without human review

### EU AI Act Art. 16 (high-risk systems)
- Risk classification stated
- Post-deployment monitoring described
- Responsible person / team identifiable

### GDPR Art. 5 (if personal data processed)
- Personal data identified and documented
- Legal basis for processing stated
- Data minimisation demonstrated

### GDPR Art. 22 (if automated decisions affect persons)
- No solely automated decisions with legal effect — OR lawful basis documented
- Human intervention mechanism in place
- Data subjects informed of automated decision-making

### GDPR Art. 25 (if personal data involved in system design)
- Privacy-by-design measures documented
- Privacy by default demonstrated
- Technical and organisational measures described

---

## Key constraints

| Constraint | Reason |
|---|---|
| Never read JSON content from `task-history/` | Structural metadata only — content may be confidential |
| Never execute build tools, tests, or linters | Skill is code-tool-free; safe for non-developer consultants |
| Never hardcode dates | All timestamps resolved dynamically at runtime |
| Never fabricate values | Unverified fields shown as `[consultant to confirm]` in amber |
| Legal Reference Appendix is mandatory | Provides verified article citations and law URLs in every output |

---

## Legal reference sources used in this skill

All article texts were verified against live sources before being embedded in the skill:

| Source | Verified articles |
|---|---|
| `artificialintelligenceact.eu` | EU AI Act Art. 13, 14, 16, 50 |
| `gdpr-info.eu` | GDPR Art. 5, 22, 25 |
| `eur-lex.europa.eu` | Official texts for both regulations |

> **Disclaimer:** This skill and its outputs reference EU regulations for transparency purposes.
> They do not constitute legal advice. Consult qualified legal counsel to determine the full
> applicability of these regulations to a specific system and deployment context.

---

## task-history/ — Structure and Maintenance

The `task-history/` folder is the **audit trail** for all AI-assisted work in the project.
Every completed Bob task session is exported as a JSON file and placed into a numbered folder.
This folder is the primary evidence source for this skill.

### Folder structure

```
task-history/
├── 01_init_setup_bob/
│   └── bob-task-18fe7f75426085f1c6231844d61a65ae-2026-08-20.json
├── 02_initial_spec_drive_dev_plan/
│   └── bob-task-<id>-<date>.json
├── ...
└── 61_verify_task_export/
    └── bob-task-9f4ffb0856d4c846b74c35799cf5debc-2026-09-30.json
```

### Folder naming convention

```
<NUMBER>_<TASK_TITLE_SLUGIFIED>/
```

| Part | Rule | Example |
|---|---|---|
| `NUMBER` | Two-digit zero-padded sequence, increment by 1 per task | `01`, `02`, … `61` |
| `TASK_TITLE_SLUGIFIED` | Lowercase words separated by `_`, max. 50 characters | `init_setup_bob` |

Full example: `42_fix_conversation_inspector_id_handling/`

The JSON file inside follows the Bob export naming convention:

```
bob-task-<session-id>-<YYYY-MM-DD>.json
```

### File size reference

| Size range | Typical session type |
|---|---|
| 100–300 KB | Short setup or configuration task |
| 300 KB – 2 MB | Standard implementation task |
| 2 MB – 10 MB | Complex multi-file refactoring or evaluation task |

### What this skill reads from task-history/

The task-history JSON files are the **primary evidence source** for this skill.
The skill reads them in two passes:

**Pass 1 — structural metadata (from directory listing):**

| What is read | How it is used |
|---|---|
| Folder names (`01_init_setup_bob/`) | Session titles and phase grouping |
| JSON filename date (`2026-08-20`) | First/last session date, development span |
| JSON file size (from `ls -la`) | Largest session proxy metric |
| Total folder count | Total AI sessions metric |

**Pass 2 — session content (targeted fields from JSON files):**

| Field extracted | Maps to checklist item |
|---|---|
| Task title / first `user` message | Art. 13 — development record, intended purpose |
| `model` field | Art. 13 — AI tool and model transparency |
| Bob modes in session headers | Art. 13 — tool provenance |
| Filenames from `write_file` / `apply_diff` calls | Art. 13 — system description |
| Human follow-up messages after tool calls | Art. 14 — human oversight evidence |
| `execute_command` calls with `pytest` / `ruff` | Art. 16 — quality assurance evidence |
| Privacy-related terms in messages | GDPR Art. 5 / 25 — data handling evidence |
| `usage` / `cost` field | Metrics table — total AI spend |

> ⚠️ **Confidentiality:** Only the specific fields above are extracted.
> Conversation text is never quoted verbatim — findings are summarised as
> structured evidence. Personal data found in sessions is never reproduced.

---

## How `task-history/` is filled in this workspace

Entries can be created **automatically** (once enabled) by the lifecycle hook
[`.bob/hooks/export-task-history.mjs`](../../hooks/export-task-history.mjs), registered on the
Bob `Stop` event in [`.bob/settings.json`](../../settings.json).

| Step | How |
|---|---|
| Trigger | End of every task turn (`Stop`); later turns of the same task update the same folder |
| Data source | `~/.bob/db/bob.db` (read with `python3`), fallback: IDE `globalStorage` |
| Folder name | `<NN>_<slug>/`, slug from the task title or first prompt |
| Files | `bob-task-<id>-<YYYY-MM-DD>.json`, plus `ui_messages.json` and `api_conversation_history.json` when available |
| Requirement | Trusted workspace (hooks do not run otherwise) |

Manual export (from the workspace root, optional task ID):

```bash
node .bob/hooks/export-task-history.mjs [taskId]
```

> In the workshop, `task-history/` is listed in `.bobignore` and is **not committed**
> (see `AGENTS.md`). Remove it from `.bobignore` before running this skill, otherwise
> Bob cannot read the exports.
>
> The workshop does this in Lab 6, Step 6.5: comment the line out, run the skill, then restore it.

