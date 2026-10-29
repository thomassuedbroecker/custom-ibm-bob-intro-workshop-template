# Lab 3: Building a Resilient Microservice

**Duration:** 45 minutes
**Goal:** Scaffold, implement, test, and debug an Express.js REST microservice with rate-limiting and unit tests, keeping implementation clean and under 80 lines.
**IBM Bob Version:** Authored with **IBM Bob 2.2.3**

> **📖 IBM Bob Documentation References:**
> - [Scaffolding & Modernizing Node.js APIs](https://bob.ibm.com/docs/ide/tutorials/modernize-nodejs-express-api) (`docs/ide/tutorials/modernize-nodejs-express-api`)
> - [Auto-approving Terminal Commands & Tool Actions](https://bob.ibm.com/docs/ide/features/auto-approving-actions) (`docs/ide/features/auto-approving-actions`)
> - [Iterative Debugging & Testing Patterns](https://bob.ibm.com/docs/ide/getting-started/best-practices) (`docs/ide/getting-started/best-practices`)

> **🧭 Where do I type?** 💬 = **Bob chat** (agentic sidebar). 🖥️ = **your own terminal** (**Terminal → New Terminal**). Never paste shell commands (`npm`, `node`, `curl`) into the Bob chat and never paste chat prompts into the terminal. See [Where Do I Type This?](README.md#where-do-i-type-this-chat-vs-terminal-vs-editor).

> **💡 Name your Bob tasks.** When starting a new task in Bob, give it a short descriptive title (e.g. `"Lab 3 - Microservice"`). The title is used when exporting session history to `task-history/` and is required for the AI Regulatory Compliance skill to produce accurate provenance records. Unnamed tasks export as `NN_unnamed_task/`.
>
> **This lab uses two terminals.** **Terminal 1** runs the server (`node index.js`) and stays busy. **Terminal 2** runs `curl` and `npm test`. Open a second one with the **+** icon in the terminal panel.
>
> **⚠️ Do not run inline tests.** Bob may attempt to verify the server with an inline `node -e "..."` command. This fails with HTTP 500 because `__dirname` is not available in that context. Always start the server with `node index.js` in Terminal 1 and test with `curl` from Terminal 2 as shown in Step 3.3.

---

## 1. Objectives

By the end of this lab, you will:
- Direct Bob to scaffold a full Node.js Express application **in its own folder**.
- Implement an in-memory sliding window rate limiter.
- Generate and run automated tests using Node's native test runner (`node:test`).
- Use Bob to diagnose and fix a runtime bug.

> **📁 Where does the application go?**
> The microservice lives in its own folder, `workshop-apps/lab-3-resilient-service/`, with its own `package.json` and `node_modules/`. **Never generate it in the repository root**, where the workshop files (`AGENTS.md`, `README.md`, `.bob/`) live. This rule is defined in [`AGENTS.md`](../AGENTS.md).
>
> Final layout:
> ```text
> workshop-apps/lab-3-resilient-service/
> ├── index.js
> ├── package.json
> ├── data/sample.json
> └── test/api.test.js
> ```

---

## 2. Step-by-Step Instructions

### Step 3.1: Scaffolding the Service
1. 💬 **In the Bob chat**, submit:
   ```markdown
   Create the folder `workshop-apps/lab-3-resilient-service/` and scaffold an Express application in it. All files must be inside that folder, not in the repository root:
   1. `index.js`: GET `/health` returning `{ status: "UP", timestamp: ISOString }`
   2. `index.js`: GET `/api/data` reading JSON from `data/sample.json`
   3. `index.js`: an in-memory rate limiter on `/api/data` limiting clients to 5 requests per 10-second window. Return HTTP 429 when exceeded.
   4. `package.json` with `express` and a `start` script.
   5. Keep `index.js` concise and under 80 lines.
   ```

2. 💬 **In the Bob chat**, generate the seed data:
   ```markdown
   Create `workshop-apps/lab-3-resilient-service/data/sample.json` as a top-level JSON array (not wrapped in an object) of 3 sample workshop services, each with `id`, `name`, and `status` fields. Example structure:
   [
     { "id": "1", "name": "Auth Service", "status": "operational" },
     { "id": "2", "name": "Inventory Service", "status": "degraded" },
     { "id": "3", "name": "Notification Service", "status": "operational" }
   ]
   ```

3. 🖥️ **Terminal 1 (repository root) — Verification:** the repository root must still contain no `index.js`, `package.json` or `data/` folder:
   ```bash
   ls workshop-apps/lab-3-resilient-service
   ls
   ```
4. 🖥️ **Terminal 1 (repository root) — Verify the data shape:** the first character of `sample.json` must be `[` (a top-level array). If it is `{`, Bob wrapped the data in an object (for example `{"items": [...]}`). Run the second prompt again.
   ```bash
   head -c 1 workshop-apps/lab-3-resilient-service/data/sample.json; echo
   ```

---

### Step 3.2: Installing Dependencies & Starting the Service
🖥️ **Terminal 1:** all commands in this lab run **inside the app folder**. Type them yourself in the terminal, not in the Bob chat:
```bash
cd workshop-apps/lab-3-resilient-service
```

1. 🖥️ **Terminal 1:** install dependencies:
   ```bash
   npm install
   ```
2. 🖥️ **Terminal 1:** start the service. Use the foreground command; the terminal stays busy while the server runs (leave it open, and stop it with `Ctrl+C` when told to):
   ```bash
   node index.js
   ```

---

### Step 3.3: Endpoint Verification
🖥️ **Terminal 2:** open a second terminal (**+** in the terminal panel) and run the commands below there. Terminal 1 is occupied by the server.

1. 🖥️ **Terminal 2:** test the `/health` endpoint:
   ```bash
   curl -i http://localhost:3000/health
   ```
   *Expected: HTTP 200 OK with JSON payload.*

2. 🖥️ **Terminal 2:** test the `/api/data` endpoint:
   ```bash
   curl -s http://localhost:3000/api/data
   ```

3. 🖥️ **Terminal 2:** test the Rate Limiter by firing 6 rapid requests:
   ```bash
   for i in {1..6}; do curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/api/data; done
   ```
   *Expected: Five `200` responses followed by one `429`.*

> **⏱️ The rate limiter keeps its counters in memory.** After this step the running server has used up its 5 requests for the next 10 seconds (`/api/data` returns `429`). Wait 10 seconds or restart the server before you call `/api/data` again. The automated tests in Step 3.4 start their **own** server, so they are not affected by this one.

---

### Step 3.4: Automated Unit Tests
Tests that start a server often fail for three reasons: the rate limiter state is shared between tests, a test server is not closed (so `npm test` never ends), or the test calls the server in Terminal 1 (port 3000), which has already used up its requests. The prompt below avoids all three.

1. 💬 **In the Bob chat**, ask Bob to create test cases:
   ```markdown
   Create a test suite in `workshop-apps/lab-3-resilient-service/test/api.test.js` using Node's native `node:test` and `node:assert` modules.
   - Import the app from `../index.js`. Start it once with `app.listen(0)` in `test.before` and close it in `test.after`. Do not use port 3000 and do not start any background process (no `&`).
   - Test 1: `GET /health` returns 200 and `status` is `"UP"`.
   - Test 2 (must run last): six requests to `/api/data` return `200` five times and then `429`. Run it last, because the rate limiter state is shared in memory.
   Add `"test": "node --test"` to `workshop-apps/lab-3-resilient-service/package.json`, run `npm test` in that folder, and show me the result.
   ```
2. 🖥️ **Terminal 2:** run the tests from the app folder:
   ```bash
   cd workshop-apps/lab-3-resilient-service
   npm test
   ```
   *Expected: `# pass 2` and `# fail 0`, and the command returns to the prompt by itself. If it does not return within about 10 seconds, press `Ctrl+C` and see the table in Section 3.*

---

### Step 3.5: Agentic Debugging Scenario
1. 💬 **In the Bob chat**, introduce a deliberate error or ask Bob:
   ```markdown
   In `workshop-apps/lab-3-resilient-service/index.js`, refactor the rate limiter to use client IP fallback when `req.ip` is undefined, and handle JSON read errors gracefully if `data/sample.json` is missing.
   ```
2. Verify that Bob updates [`index.js`](../workshop-apps/lab-3-resilient-service/index.js) with minimal and targeted diffs.
3. 🖥️ **Terminal 1:** restart the service so it picks up the change. Press `Ctrl+C` to stop the running server, then start it again (otherwise port 3000 stays busy):
   ```bash
   node index.js
   ```

---

### Step 3.6: Cleanup
🖥️ **Terminal 1:** press `Ctrl+C` to stop the server when you are done. If port 3000 is still busy (`EADDRINUSE`), find and stop the leftover process in a terminal:
```bash
kill $(lsof -ti :3000)
```
`node_modules/` is ignored by Git, so it will not appear in later commits.

---

## 3. If Something Goes Wrong

| Symptom | Fix |
| :--- | :--- |
| `curl` returns HTTP 500 on first run | Bob may have run an inline `node -e` test that lacks `__dirname`. Stop any running process (`Ctrl+C`), restart with `node index.js` in Terminal 1, then re-test from Terminal 2. |
| `npm test` fails with `Missing script: "test"` | `package.json` has no test script. Ask Bob to add `"test": "node --test"`, or check with `npm run`. |
| `npm test` never finishes | A test server is not closed. Press `Ctrl+C`. In `test/api.test.js` the server must be started in `test.before` and closed in `test.after`. Ask Bob to fix exactly that. |
| A test gets `429` where it expects data | The rate limiter state is shared in memory. Put the rate-limit test last, or wait 10 seconds. Never run the tests against the server in Terminal 1. |
| The command hangs or is canceled when Bob starts the server | Bob started the server with `&` in the same command. Stop it, and tell Bob not to start background processes (use `app.listen(0)` in tests, and `node index.js` in Terminal 1 yourself). |
| `/api/data` returns `{"items": [...]}` instead of an array | Step 3.1 item 2 was skipped, so `sample.json` has a different shape. Run that prompt again and check with the `head -c 1` command in Step 3.1. |
| `EADDRINUSE: address already in use :::3000` | A previous server process is still running. Kill it: `kill $(lsof -ti :3000)` |
| `Cannot find module 'express'` | `npm install` was not run yet, or was run in the wrong folder. Run it inside `workshop-apps/lab-3-resilient-service/`. |
| Rate limiter never returns 429 | The loop ran too slowly and the 10-second window reset between requests. Use the one-liner in Step 3.3 which fires all 6 requests back-to-back. |

---

## 4. Key Takeaways
- Bob scaffolds production-quality boilerplates without extraneous complexity.
- Keeping each generated app in its own folder keeps the workshop template clean and makes later Git commits easy to scope.
- Native terminal execution allows Bob to run `npm test` and iterate on failures automatically.
