<!-- Context: portfolio-site/concepts/test-venv-isolation | Priority: high | Version: 1.0 | Updated: 2026-09-11 -->

# Concept: Venv-Isolated Test Environments

**Core Idea**: Test tooling lives in isolated virtual environments under `testenv/`, so the repo root stays zero-dependency (only `node:test` built-ins). Each env has its own `package.json` + `playwright.config.js`.

**Key Points**:
- Layout: `testenv/{unit,integration,e2e}/` — unit env has no modules (`node:test` ships with Node); integration + e2e each pin the same `@playwright/test` version
- Bootstrap: `npm run venv:setup` → `testenv/setup.sh` (idempotent) installs envs and Chromium into `testenv/browsers/` via `PLAYWRIGHT_BROWSERS_PATH`
- Shared config factory: `testenv/base-config.cjs` computes repo root, testDir, webServer, and browser sandbox path
- webServer = `python3 -m http.server` (no JS server dep); disabled when `BASE_URL` is set (deployed runs)
- Git: manifests/configs tracked; `testenv/*/node_modules/`, `testenv/*/test-results/`, `testenv/browsers/` ignored

**Quick Example**:
```bash
npm run venv:setup          # provision envs + Chromium
npm run test:integration    # NODE_PATH=testenv/integration/node_modules playwright test --config testenv/integration/playwright.config.js
```

**Reference**: `.opencode/context/core/context-system/operations/harvest.md`

**Related**:
- `errors/playwright-venv-setup.md` — gotchas when running Playwright from venvs
- `guides/running-tests.md` — full test pyramid workflow
- `lookup/test-inventory.md` — scripts, counts, DOM hooks