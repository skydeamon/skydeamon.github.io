<!-- Context: portfolio-site/errors/playwright-venv-setup | Priority: high | Version: 1.0 | Updated: 2026-09-11 -->

# Error: Playwright in Isolated Venvs — Setup Gotchas

**Core Idea**: Playwright specs live in `tests/` but the runner lives in `testenv/{env}/node_modules`. Several resolution quirks must be handled.

**Key Points**:
- **Config**: must be passed explicitly — `playwright test --config testenv/{env}/playwright.config.js` (root has no config; `require('@playwright/test')` resolves from inside the venv)
- **Spec imports**: `require('@playwright/test')` in `tests/*.spec.js` fails unless `NODE_PATH=testenv/{env}/node_modules` is set (Node walks up from `tests/`, never sideways into the venv)
- **Output dirs**: gitignore `testenv/*/test-results/`
- **Hidden elements**: mobile-only controls (e.g. `#nav-burger`) are `display:none` at Playwright's default 1280×720 → use `test.use({ viewport: { width: 390, height: 844 } })`
- **URLs**: home is `/index.html`, not `/` → assert `toHaveURL(/index\.html$/)`
- **Selectors**: print button `aria-label` varies by page group ("Print CV" on CVs) → select by tag+class (`button.control-btn.secondary`), not aria-label
- **OS warning**: "your OS is not officially supported… fallback build for ubuntu24.04-x64" is harmless

**Quick Example**:
```bash
NODE_PATH=testenv/integration/node_modules npm --prefix testenv/integration exec -- \
  playwright test --config testenv/integration/playwright.config.js --project=integration
```

**Reference**: `.opencode/context/core/context-system/operations/harvest.md`

**Related**:
- `concepts/test-venv-isolation.md` — the venv architecture
- `guides/running-tests.md` — run commands