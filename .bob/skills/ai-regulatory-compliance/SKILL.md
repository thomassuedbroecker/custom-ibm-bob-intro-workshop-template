---
name: ai-regulatory-compliance
description: Use when an IT service consultant wants to generate, update, or validate an AI Regulatory Compliance Provenance document describing HOW a client application was BUILT with an AI coding assistant (AI-assisted development). It does NOT assess AI features that the built application uses at runtime. Covers EU AI Act (Art. 13, 14, 16, 50) and GDPR (Art. 5, 22, 25). Requires a task-history/ folder of exported AI session JSON files. No code execution required — all evidence is derived from folder structure and consultant-confirmed facts.
---

# AI Regulatory Compliance Provenance Skill

> **Audience:** IT service consultants preparing compliance evidence for clients.
> **Regulations covered:**
> - EU AI Act — Regulation (EU) 2024/1689 — Art. 13, 14, 16, 50
> - GDPR — Regulation (EU) 2016/679 — Art. 5, 22, 25
>
> **Official texts:**
> - EU AI Act: <https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689>
> - GDPR: <https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32016R0679>
>
> **No coding required.** This skill collects structural facts from the project
> and consultant-confirmed answers — it never executes tests or build tools.

---

## Scope — AI-Assisted Development Only (read first)

This skill documents **how the application was built with an AI coding assistant**
(e.g. IBM Bob). The subject of every section and every checklist item is the
**AI-assisted development process**: the assistant, its sessions, its permissions,
what data it could see, who reviewed what it produced.

| In scope | Out of scope |
|---|---|
| The AI coding assistant, model, modes, skills, MCP servers | LLMs, agents or models that the **built application calls at runtime** |
| `task-history/` session exports, approval/permission settings | Runtime behaviour, end users and decisions of the built application |
| Code, docs, tests, specs and fixtures **produced by** the assistant | Accuracy, bias or risk of the application's own AI features |
| Data the assistant could read or process during development | Data the application processes in production |
| Human review of assistant output before commit/release | Production monitoring of the application's AI output |

Rules that follow from this scope:

1. Never describe the built application's own AI features (agents, categorisation,
   summarisation, runtime LLM names) as evidence or as a finding. If they exist, add
   **one** sentence under *Limitations & Known Gaps*: "AI features of the built
   application are out of scope and require a separate assessment."
2. The "System Description" section describes the **built application only as the
   object of development** (name, purpose, repository, size/composition) — not its AI behaviour.
3. If the consultant states that the built application is itself an AI system placed on
   the market, record that as a limitation; do not assess it here.
4. Every checklist item below is read in the development context (see the
   *Development-scope reading* note under each article).
5. If a prompt field still contains an unfilled template placeholder such as
   `[Client or company name]` or `[e.g. …]`, treat it as **not provided** and ask in Step 2.

---

## Step 0 — Verify the Workspace Prerequisites

Check the following before proceeding. Stop and report any missing item clearly.

1. A `task-history/` folder exists in the workspace root.
2. It contains at least one sub-folder named `<NN>_<title>/` (numbered session folders; older exports may use `<NN>-<title>/`).
3. Each sub-folder contains one `bob-task-<id>-<date>.json` file (the AI session export).

If `task-history/` is missing, stop and tell the consultant:
> `task-history/` is required. Ask the engineering team to export each Bob task session
> as a JSON file and place them in numbered sub-folders before running this skill.

---

## Step 1 — Gather Structural Facts from task-history

### 1a — Directory listing

Use `execute_command` with:

```bash
ls -la task-history/*/
```

From the output collect:

| Fact | How to derive it |
|---|---|
| Total AI sessions | Count of numbered sub-folders |
| First session date | Date in the filename of the earliest JSON (`bob-task-*-<YYYY-MM-DD>.json`) |
| Last session date | Date in the filename of the most recent JSON |
| Development span | Calendar days between first and last session date |
| Largest session (size proxy) | Largest `.json` file size from the directory listing |

### 1b — Read session content for compliance evidence

The JSON export files are the **primary evidence source** for this skill.
Read them to extract concrete, auditor-verifiable facts for the compliance checklist.

For each session file, use `read_file` on the JSON. The Bob export JSON contains a
`messages` array. Each message has a `role` (`user` / `assistant`) and `content`.
Read selectively — you do not need to read every message in every file.

**What to extract and where it maps:**

| Evidence to extract | How to find it in the JSON | Maps to |
|---|---|---|
| Task title / objective | First `user` message in the session | Art. 13 — intended purpose, development record |
| AI tool and model used | `model` field at the top level of the JSON | Art. 13 — tool transparency |
| Bob modes used | Look for mode names in early `user` or `system` messages | Art. 13 — tool transparency |
| Files created or modified | `assistant` messages calling `write_file`, `apply_diff`, `insert_content` — extract filenames only | Art. 13 — system description |
| Human approval / review actions | Presence of `user` follow-up messages after `assistant` tool calls — shows human was in the loop | Art. 14 — human oversight |
| Test execution evidence | `assistant` messages calling `execute_command` with `pytest`, `ruff`, `test` | Art. 16 — quality assurance |
| Data privacy mentions | Search for `personal`, `PII`, `GDPR`, `synthetic`, `upload guard` in messages | GDPR Art. 5 / 25 |
| Session cost (Bob-coins) | `usage` or `cost` field at the top level | Metrics table |

**Sampling strategy — do not read every file in full:**

1. Read the **first and last session** in full (earliest and most recent).
2. For all other sessions, read only the **first 50 lines** using `read_file` with `range: "1-50"` to get the task title and model.
3. If a specific checklist item needs more evidence, read the relevant session in full.

> ⚠️ **Confidentiality reminder:** Session JSON files may contain source code, internal
> discussions, or client-specific information. Extract only the specific fields listed above.
> Do not quote conversation text verbatim in the compliance document — summarise findings
> as structured evidence (e.g. "Session 14: human follow-up messages confirm review of
> all file writes"). Never reproduce personal data found in session content.

---

## Step 2 — Gather Client & Project Information (Consultant Interview)

Use `ask_followup_question` to collect the following from the consultant.
Ask as a single structured set — do not ask one question at a time.
Collect only what cannot be found by inspecting the project (Step 2.5 will look for the rest).

| Field | Regulation link | Why consultant input is needed |
|---|---|---|
| Client / project name | — | Not discoverable from code |
| Human oversight policy | EU AI Act Art. 14 | Cannot be inferred from code |
| Risk classification of the system | EU AI Act Art. 16 | Legal judgement — consultant must confirm |
| Does the system interact directly with end users? | EU AI Act Art. 50 | Deployment context — consultant must confirm |
| Was personal data processed by the AI tool? | GDPR Art. 22 / 25 | Cannot be determined from code alone |
| Responsible person or team contact | EU AI Act Art. 16 | Not in code |
| Are there known gaps or limitations? | — | Consultant perspective |

Mark any unanswered field as `[consultant to confirm]` — never invent values.

---

## Step 2.5 — Inspect Project Content for Evidence

Before evaluating the checklist, actively read project artefacts to find concrete evidence.
This reduces reliance on declared facts and produces auditor-verifiable citations.

For each item below, use `read_file`, `grep`, `glob`, or `execute_command` (read-only) to
locate the evidence. Record: what was found, in which file, and at which line or section.
If evidence is not found, record `[not found in project]` — do not ask the consultant.

### A — System identity and purpose (→ Art. 13)

| Evidence to find | Where to look | Tool |
|---|---|---|
| Project / system name | `README.md` — title or first heading | `read_file` |
| Intended purpose description | `README.md` — overview or objectives section | `read_file` |
| Current version or release tag | `pyproject.toml`, `package.json`, `VERSION`, `CHANGELOG.md`, git tags | `read_file` / `execute_command rtk git tag` |
| Repository URL | `README.md`, `pyproject.toml`, `AGENTS.md` | `read_file` |
| Review period (derive from task-history dates found in Step 1) | Already collected | — |

### B — AI tool provenance (→ Art. 13)

| Evidence to find | Where to look | Tool |
|---|---|---|
| AI tool name and model | `.bob/settings.json`, `AGENTS.md`, any `docs/` mention | `read_file` |
| Bob session export format | Presence of `task-history/` confirmed in Step 1 | — |
| Modes used during development | `AGENTS.md`, `.bob/custom_modes.yaml` | `read_file` |
| Data processed by AI tool | `AGENTS.md` privacy notes, `README.md`, `docs/` specs | `grep -r "personal\|PII\|privacy\|synthetic\|test fixture" docs/ README.md` |

### C — Human oversight evidence (→ Art. 14)

| Evidence to find | Where to look | Tool |
|---|---|---|
| Human oversight / approval policy | `AGENTS.md`, `docs/`, `README.md`, `.bob/settings.json` | `read_file` |
| Review process description | `AGENTS.md`, `docs/`, `CONTRIBUTING.md` | `read_file` |
| Mention of no unreviewed AI output | `AGENTS.md`, `docs/` | `grep -r "review\|approve\|oversight\|human" AGENTS.md docs/` |

### D — Test and quality evidence (→ Art. 16)

| Evidence to find | Where to look | Tool |
|---|---|---|
| Test framework and passing tests | `pyproject.toml`, `tests/` folder existence, CI config | `glob "tests/**/*.py"` / `read_file pyproject.toml` |
| Linter / code quality configuration | `pyproject.toml`, `ruff.toml`, `.flake8` | `read_file` |
| Post-deployment monitoring approach | `docs/`, `README.md`, governance dashboard references | `grep -r "monitor\|dashboard\|eval\|governance" docs/ README.md` |
| Responsible person / contact | `README.md`, `pyproject.toml` authors field, `AGENTS.md` | `read_file` |

### E — Data privacy evidence for the development process (→ GDPR Art. 5 / 22 / 25)

| Evidence to find | Where to look | Tool |
|---|---|---|
| Personal data handling policy | `AGENTS.md`, `docs/`, spec files | `grep -r "personal data\|PII\|GDPR\|privacy" docs/ AGENTS.md` |
| Data minimisation measures | `AGENTS.md`, spec files, fixtures README/manifest | `grep -r "minimis\|synthetic\|anonymi\|pseudonym" docs/ AGENTS.md tests/fixtures/` |
| Privacy-by-design measures for the development process | `docs/`, `AGENTS.md`, `.gitignore`, assistant rules (`.bob/rules*`), plan/spec constraints that limit data given to the assistant (e.g. "use synthetic fixtures only") | `grep -r "synthetic\|fixture\|do not upload\|restriction" docs/ AGENTS.md .bob/` |
| What the assistant could read | Assistant permission settings in the session exports (`approvalConfig`), `.bobignore` / ignore files, `.gitignore` entries for input-data folders | `read_file` / `glob` |
| Whether non-synthetic data was handled by the assistant | Tool calls in session exports that read or list input-data folders (paths and tool names only) | `grep` on `task-history/` |
| Decisions about persons made by the assistant | Assistant outputs are code/docs only — confirm no session task evaluates or decides about individuals | session titles |

### Evidence grading

After inspection, assign each piece of evidence one of three source grades:

| Grade | Meaning |
|---|---|
| 📄 **Found in project** | Evidence located in a specific file and line — cite it |
| 🗣️ **Declared by consultant** | Confirmed by consultant in Step 2 — note as declared |
| ❌ **Not found** | Not in project files and not declared — mark as gap |

Only evidence graded 📄 or 🗣️ may be used to mark a checklist item ✓.
Evidence graded ❌ must produce a ~ or ✗ status.

---

## Step 3 — Verify the Regulatory Compliance Checklist

Walk through each item below. Assign one of three statuses based on
evidence collected in Steps 1, 2, and 2.5. For every item, record the
**evidence source** (file + line, or "declared by consultant", or "not found"):

- **✓ met** — evidence is present and confirmed
- **~ partial** — partially addressed; a remediation note is required
- **✗ gap** — no evidence; a remediation action is required

---

### EU AI Act — Art. 50 — Transparency Obligations for Providers and Deployers

> **Chapter IV · Regulation (EU) 2024/1689**
> Operative text (§1): *"Providers shall ensure that AI systems intended to interact directly with natural persons are designed and developed in such a way that the natural persons concerned are informed that they are interacting with an AI system, unless this is obvious from the point of view of a natural person who is reasonably well-informed, observant and circumspect."*
> Enforcement date: **2 August 2026** — earlier than Art. 13/14/16; applies to all AI tiers
> Full text: <https://artificialintelligenceact.eu/article/50/>
> EUR-Lex: <https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689>

> 🔴 **Already in force.** Art. 50 has been legally binding since 2 August 2026.
> If the system interacts with end users, these items are a **current legal obligation** —
> not a future one. Inform the consultant of this before proceeding.

Checklist items derived from Art. 50 §1–§2:

- [ ] End users are informed they are interacting with an AI system (unless self-evident)
- [ ] AI-generated content (text, images, audio, video) is disclosed as AI-generated where required
- [ ] Deep-fake or synthetic media disclosures are in place (if applicable)

> **Development-scope reading:**
> - *Users informed of AI interaction* → the people using the assistant (developers) know they work with an AI assistant. Normally self-evident (✓ with note); record the evidence.
> - *AI-generated content disclosed* → code, docs, specs, tests and fixtures produced by the assistant are **identifiable as AI-assisted** in the repository (README/AGENTS statement, commit trailers such as `Co-authored-by`, `task-history/`). Check README and `git log`.
> - *Synthetic media* → AI-generated **synthetic test data** (e.g. fixtures) is labelled as synthetic and, ideally, as AI-generated. Mark "not applicable" only if no such data was generated.
> - Do not evaluate any disclosure shown to end users of the built application — out of scope.

---

### EU AI Act — Art. 13 — Transparency and Provision of Information to Deployers

> **Chapter III, Section 2 · Regulation (EU) 2024/1689**
> Operative text (§1): *"High-risk AI systems shall be designed and developed in such a way as to ensure that their operation is sufficiently transparent to enable deployers to interpret a system's output and use it appropriately."*
> Enforcement date: 2 December 2027 (Annex III systems) · 2 August 2028 (Annex I systems)
> Full text: <https://artificialintelligenceact.eu/article/13/>
> EUR-Lex: <https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689>

> 🟡 **Future obligation** — not yet legally binding. However, preparing this evidence
> now is the correct approach: retroactive documentation of a completed project is far
> harder than maintaining the audit trail during development.

Checklist items derived from Art. 13 §2 (instructions for use requirements):

- [ ] AI tool name and version are documented
- [ ] Development / engagement period is documented
- [ ] Intended purpose of the AI-assisted development (what was built and why) is described
- [ ] Capabilities and limitations of the AI-assisted development process are stated (what the assistant did, what it did not do, known weaknesses)
- [ ] Types of data processed by the AI tool during development are described (personal data specifically)
- [ ] Session audit trail is retained (`task-history/` JSON exports present)

---

### EU AI Act — Art. 14 — Human Oversight

> **Chapter III, Section 2 · Regulation (EU) 2024/1689**
> Operative text (§1): *"High-risk AI systems shall be designed and developed in such a way, including with appropriate human-machine interface tools, that they can be effectively overseen by natural persons during the period in which they are in use."*
> Enforcement date: 2 December 2027 (Annex III systems) · 2 August 2028 (Annex I systems)
> Full text: <https://artificialintelligenceact.eu/article/14/>
> EUR-Lex: <https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689>

> 🟡 **Future obligation** — not yet legally binding. Document now to avoid retroactive gaps.

Checklist items derived from Art. 14 §1–§4:

- [ ] Human oversight mode is documented (supervised / auto-approval / manual-only)
- [ ] Review and approval process for AI-generated outputs is described
- [ ] Explicit statement that no AI output was deployed without human review

---

### EU AI Act — Art. 16 — Obligations of Providers of High-Risk AI Systems

> **Chapter III, Section 3 · Regulation (EU) 2024/1689**
> Operative text (chapeau): *"Providers of high-risk AI systems shall: (a) ensure that their high-risk AI systems are compliant with the requirements set out in Section 2; (c) have a quality management system in place which complies with Article 17; (d) keep the documentation referred to in Article 18; (e) keep the logs automatically generated by their high-risk AI systems as referred to in Article 19."*
> Enforcement date: 2 December 2027 (Annex III systems) · 2 August 2028 (Annex I systems)
> Full text: <https://artificialintelligenceact.eu/article/16/>
> EUR-Lex: <https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689>

> 🟡 **Future obligation** — not yet legally binding. Document now to avoid retroactive gaps.

Checklist items derived from Art. 16 (a), (c), (d), (e):

- [ ] Risk classification of the AI-assisted development use is stated (high-risk / limited-risk / minimal-risk) — legal judgement, consultant must confirm; never classify the built application here
- [ ] Quality assurance of AI-produced output is described (tests, linting, reviews, evaluation of generated code) — instead of post-deployment monitoring of an AI product
- [ ] A responsible person or team is identifiable in the document

---

### GDPR — Art. 5 — Principles Relating to Processing of Personal Data

> **Chapter II · Regulation (EU) 2016/679**
> Operative text (§1): *"Personal data shall be: (a) processed lawfully, fairly and in a transparent manner in relation to the data subject ('lawfulness, fairness and transparency'); (b) collected for specified, explicit and legitimate purposes ('purpose limitation'); (c) adequate, relevant and limited to what is necessary ('data minimisation')."*
> Applies: immediately; GDPR has been in force since 25 May 2018
> Full text: <https://gdpr-info.eu/art-5-gdpr/>
> EUR-Lex: <https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32016R0679>

> **Applicability:** Check only if the AI coding assistant processed personal data during the project
> (anything the assistant could read or received in prompts, files or command output).
> If no personal data was processed, mark all items ✓ and note "No personal data processed."
> Unconfirmed → do **not** use this shortcut; assess the items.

Checklist items derived from Art. 5 §1(a–c):

- [ ] Personal data processed by the AI tool is identified and documented
- [ ] The legal basis for any personal data processing by the AI tool is stated
- [ ] Data minimisation is demonstrated (only necessary data sent to the AI tool)

---

### GDPR — Art. 22 — Automated Individual Decision-Making, Including Profiling

> **Chapter III · Regulation (EU) 2016/679**
> Operative text (§1): *"The data subject shall have the right not to be subject to a decision based solely on automated processing, including profiling, which produces legal effects concerning him or her or similarly significantly affects him or her."*
> Applies: immediately; GDPR has been in force since 25 May 2018
> Full text: <https://gdpr-info.eu/art-22-gdpr/>
> EUR-Lex: <https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32016R0679>

> **Applicability:** Check only if the AI coding assistant makes or influences decisions that
> produce legal effects on natural persons. An assistant that produces code and documents
> does not decide about data subjects: mark the items ✓ with the note
> "Development scope — assistant produces code/docs only; no decisions about natural persons.
> Runtime decisions of the built application are out of scope." Cite the evidence (session titles / tool types).

Checklist items derived from Art. 22 §1–§3:

- [ ] The system does not make solely automated decisions with legal/significant effect on persons — OR a lawful basis (contract, law, consent) is documented
- [ ] Where automated decisions are made, a human intervention mechanism is in place
- [ ] Data subjects are informed of any automated decision-making that affects them

---

### GDPR — Art. 25 — Data Protection by Design and by Default

> **Chapter IV · Regulation (EU) 2016/679**
> Operative text (§1): *"Taking into account the state of the art, the cost of implementation and the nature, scope, context and purposes of processing … the controller shall … implement appropriate technical and organisational measures … which are designed to implement data-protection principles, such as data minimisation, in an effective manner."*
> Applies: immediately; GDPR has been in force since 25 May 2018
> Full text: <https://gdpr-info.eu/art-25-gdpr/>
> EUR-Lex: <https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32016R0679>

> **Applicability:** Check if personal data could reach the AI coding assistant during development.
> Assess privacy-by-design of the **development process** (what the assistant may read, what is
> kept out of its reach), not privacy features of the built application.

Checklist items derived from Art. 25 §1–§2:

- [ ] Privacy-by-design measures are documented (e.g., pseudonymisation, access controls)
- [ ] Only data necessary for each purpose is processed by default (privacy by default)
- [ ] Technical and organisational measures to protect personal data are described

---

## Step 4 — Define the Provenance Document Structure

The output document **must** contain these sections in this order.
Use only facts from Steps 1–3. Do not add content not supported by evidence.

1. **Header** — Project/client name, regulation badges (EU AI Act · GDPR), review period, version, AI tool name, total sessions, human oversight policy
2. **Executive Summary** — 2–4 sentences stating the document purpose, the regulations addressed, and that the audit trail is in `task-history/`
3. **AI-Assisted Project Metrics** — Table: total sessions, development span, largest session (file size), AI tool, oversight mode
4. **Built Application (Object of Development)** — Name, purpose, repository, composition (derived from README or consultant input — not from JSON). **No description of the application's own AI behaviour.** Include the scope statement from the *Scope* section.
5. **AI Tool Provenance** — Attribute table: tool name, model, session export format, modes used, permissions/approval settings, data the assistant could process (development only)
6. **Session Timeline** — Group `task-history/` folders into logical phases by number range; include folder count, date range, file sizes — **no JSON content**
7. **Regulatory Compliance Checklist** — One sub-section per regulation and article (EU AI Act Art. 50 / 13 / 14 / 16, then GDPR Art. 5 / 22 / 25); each item with ✓ / ~ / ✗ and a one-line evidence note
8. **Data Privacy & Ethical Use Statement** — What data was and was not processed by the AI tool; GDPR applicability determination; personal data controls in place
9. **Limitations & Known Gaps** — Honest list of what is not verifiable from the available evidence
10. **Remediation Actions** — Numbered list of actions for every ~ or ✗ item; empty section if all items are ✓
11. **Legal Reference Appendix** — Always present, always at the end of the document; use the fixed content from the **Legal Reference** section of this skill below
12. **Footer** — Generation date (resolved dynamically at runtime — never hardcoded), consultant name placeholder, disclaimer

---

## Step 5 — Generate the HTML Artifact

Write the artifact using `write_file` to:

```
.bob/artifacts/<project-slug>-ai-regulatory-compliance.html
```

HTML requirements:
- Self-contained single file — no external CDN dependencies
- Neutral professional styling (`system-ui` font, neutral palette)
- Badge row in the header: `EU AI Act 2024/1689`, `GDPR 2016/679`, risk classification level
- Two colour-coded regulation groups: blue for EU AI Act, green for GDPR
- Compliance checklist rendered with CSS `::before` symbols: ✓ (green) / ~ (amber) / ✗ (red)
- GDPR sections include an applicability note if personal data was not processed
- Session timeline rendered as bordered phase-blocks (header + body layout)
- Remediation actions rendered as a numbered list with an amber callout box
- Any field marked `[consultant to confirm]` displayed visibly in amber — never hidden
- The **Legal Reference Appendix** is always the last content section before the footer

---

## Step 6 — Deliver the Compliance Summary to the Consultant

After writing the HTML file, output a Markdown summary for the consultant to review:

```
## AI Regulatory Compliance Summary

| Regulation | Article | Requirement | Status | Evidence / Note |
|---|---|---|---|---|
```

Then state:
- **Total checklist items:** N
- **Fully met (✓):** N
- **Partial (~):** N
- **Gap (✗):** N
- **Items pending consultant confirmation:** N
- **GDPR sections skipped (no personal data):** N

If there are gaps or partial items, list numbered **Remediation Actions** the consultant
must resolve before submitting the document to the client or a compliance reviewer.

---

## Constraints

- **Never quote conversation text** from `task-history/` JSON files — use structural fields and summaries only.
- **Stay in development scope** — never assess or describe the built application's runtime AI features (see *Scope*).
- **Never execute build tools, test runners, or linters** — this skill is code-tool-free.
- **Never hardcode dates** — generation timestamp must be resolved dynamically at runtime.
- **Never fabricate values** — use `[consultant to confirm]` for any unverified field.
- **One artifact per run** — overwrite if the file already exists.
- **Auditor-ready language** — factual, neutral, no marketing or speculative claims.
- **GDPR applicability is conditional** — if no personal data was processed, mark GDPR items ✓ with note "No personal data processed — article not triggered."

---

## Legal Reference

This block is **fixed and mandatory**. Reproduce it verbatim in every generated document
as the **Legal Reference Appendix** — the last content section before the footer.
Do not paraphrase, shorten, or omit any entry.

---

### Regulation 1 — EU Artificial Intelligence Act

**Regulation (EU) 2024/1689** of the European Parliament and of the Council
of 13 June 2024 — laying down harmonised rules on artificial intelligence
and amending certain Union legislative acts

Official text (EUR-Lex):
<https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689>

Official Journal of the EU (PDF):
<https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=OJ:L_202401689>

Articles addressed in this document — all located in **Regulation (EU) 2024/1689**,
verified against the live regulation text at `artificialintelligenceact.eu`:

| Article | Official Title | Chapter / Section | Enforcement Date | Verified Source |
|---|---|---|---|---|
| **Art. 50** | Transparency Obligations for Providers and Deployers of Certain AI Systems | Chapter IV | **2 Aug 2026** — all AI tiers | <https://artificialintelligenceact.eu/article/50/> |
| **Art. 13** | Transparency and Provision of Information to Deployers | Chapter III, Section 2 | 2 Dec 2027 (Annex III) · 2 Aug 2028 (Annex I) | <https://artificialintelligenceact.eu/article/13/> |
| **Art. 14** | Human Oversight | Chapter III, Section 2 | 2 Dec 2027 (Annex III) · 2 Aug 2028 (Annex I) | <https://artificialintelligenceact.eu/article/14/> |
| **Art. 16** | Obligations of Providers of High-Risk AI Systems | Chapter III, Section 3 | 2 Dec 2027 (Annex III) · 2 Aug 2028 (Annex I) | <https://artificialintelligenceact.eu/article/16/> |

**Operative text verified from the regulation:**

- **Art. 50 §1:** *"Providers shall ensure that AI systems intended to interact directly with natural persons are designed and developed in such a way that the natural persons concerned are informed that they are interacting with an AI system, unless this is obvious from the point of view of a natural person who is reasonably well-informed, observant and circumspect."*
- **Art. 13 §1:** *"High-risk AI systems shall be designed and developed in such a way as to ensure that their operation is sufficiently transparent to enable deployers to interpret a system's output and use it appropriately."*
- **Art. 14 §1:** *"High-risk AI systems shall be designed and developed in such a way, including with appropriate human-machine interface tools, that they can be effectively overseen by natural persons during the period in which they are in use."*
- **Art. 16 (chapeau):** *"Providers of high-risk AI systems shall: (a) ensure that their high-risk AI systems are compliant with the requirements set out in Section 2; (c) have a quality management system in place which complies with Article 17; (d) keep the documentation referred to in Article 18; (e) keep the logs automatically generated by their high-risk AI systems as referred to in Article 19."*

---

### Regulation 2 — General Data Protection Regulation (GDPR)

**Regulation (EU) 2016/679** of the European Parliament and of the Council
of 27 April 2016 — on the protection of natural persons with regard to the processing
of personal data and on the free movement of such data (General Data Protection Regulation)

In force since: **25 May 2018**

Official text (EUR-Lex):
<https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32016R0679>

Articles addressed in this document — verified against `gdpr-info.eu`
(an article-by-article reference that republishes the official OJ text):

| Article | Official Title | Chapter | In Force | Verified Source |
|---|---|---|---|---|
| **Art. 5** | Principles relating to processing of personal data | Chapter II | 25 May 2018 | <https://gdpr-info.eu/art-5-gdpr/> |
| **Art. 22** | Automated individual decision-making, including profiling | Chapter III | 25 May 2018 | <https://gdpr-info.eu/art-22-gdpr/> |
| **Art. 25** | Data protection by design and by default | Chapter IV | 25 May 2018 | <https://gdpr-info.eu/art-25-gdpr/> |

**Operative text verified from the regulation:**

- **Art. 5 §1(a):** *"Personal data shall be processed lawfully, fairly and in a transparent manner in relation to the data subject ('lawfulness, fairness and transparency')."*
- **Art. 22 §1:** *"The data subject shall have the right not to be subject to a decision based solely on automated processing, including profiling, which produces legal effects concerning him or her or similarly significantly affects him or her."*
- **Art. 25 §1:** *"Taking into account the state of the art, the cost of implementation and the nature, scope, context and purposes of processing … the controller shall … implement appropriate technical and organisational measures … which are designed to implement data-protection principles, such as data minimisation, in an effective manner."*

---

### Supporting References

| Resource | Type | URL |
|---|---|---|
| EU AI Act — full text (EUR-Lex) | Official | <https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689> |
| EU AI Act — Official Journal PDF | Official | <https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=OJ:L_202401689> |
| EU AI Act Art. 50 — independent tracker | Cross-check | <https://artificialintelligenceact.eu/article/50/> |
| EU AI Act Art. 13 — independent tracker | Cross-check | <https://artificialintelligenceact.eu/article/13/> |
| EU AI Act Art. 14 — independent tracker | Cross-check | <https://artificialintelligenceact.eu/article/14/> |
| EU AI Act Art. 16 — independent tracker | Cross-check | <https://artificialintelligenceact.eu/article/16/> |
| GDPR — full text (EUR-Lex) | Official | <https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32016R0679> |
| GDPR Art. 5 — gdpr-info.eu | Cross-check | <https://gdpr-info.eu/art-5-gdpr/> |
| GDPR Art. 22 — gdpr-info.eu | Cross-check | <https://gdpr-info.eu/art-22-gdpr/> |
| GDPR Art. 25 — gdpr-info.eu | Cross-check | <https://gdpr-info.eu/art-25-gdpr/> |
| European AI Office | Official | <https://digital-strategy.ec.europa.eu/en/policies/european-approach-artificial-intelligence> |
| ENISA AI security guidance | Guidance | <https://www.enisa.europa.eu/topics/artificial-intelligence-and-next-gen-technologies> |

---

> **Disclaimer:** This document references EU regulations for transparency purposes.
> It does not constitute legal advice. Consult qualified legal counsel to determine
> the full applicability of these regulations to your specific system and deployment context.
> EU AI Act enforcement dates are derived from Article 113 of Regulation (EU) 2024/1689.
> GDPR has been fully applicable since 25 May 2018 across all EU member states.
> Applicability of GDPR articles depends on whether personal data is processed.
