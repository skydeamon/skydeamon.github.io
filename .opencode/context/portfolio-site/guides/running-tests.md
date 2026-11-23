<!-- Context: portfolio-site/guides/running-tests | Priority: high | Version: 1.2 | Updated: 2026-11-23 -->

# Guide: Running the Test Pyramid

**Core Idea**: Four tiers — static/contract, unit, integration (browser + local server), e2e (full journeys). All runnable from the repo root.

**Steps**:
1. **Provision venvs** (once, idempotent): `npm run venv:setup`
   - If Linux headless libs missing: `sudo npx --prefix testenv/integration playwright install-deps chromium`
2. **Static + unit + audit** (no browser): `npm test` → 255 tests (109 static contract + 57 unit + 89 audit)
3. **Coverage gate**: `npm run test:coverage` → same 255 tests, with 99% line / 99% function / 80% branch thresholds
4. **Integration** (local server, auto-started): `npm run test:integration` → 142 tests
5. **E2E** (local server): `npm run test:e2e` → 9 journeys
6. **Full local gate**: `npm run test:all` → Node, integration, E2E, and spell
7. **Deployed** (after push): wait for GitHub Pages rebuild, then:
   - `npm run test:e2e:deployed` (same 9 journeys vs live site)
   - `npm run test:deployed` (6 asset, PDF, content-type checks vs live site)

**Theme persistence**: portfolio pages persist the theme via `localStorage` (validated `readStoredTheme`/`writeStoredTheme` in `js/theme-store.js`); CV/engagement pages apply the stored or system preference on load. Tests assert both in-page toggling and cross-page persistence.

**Quick Reference**:
```bash
npm test                  # static + unit + audit
npm run test:coverage     # node suite + coverage thresholds
npm run test:integration  # browser, local
npm run test:e2e          # journeys, local
npm run test:all          # full local gate
npm run test:e2e:deployed # journeys, live
npm run test:deployed     # asset + PDF checks, live
```

**Reference**: `.opencode/context/core/standards/test-coverage.md`

**Related**:
- `concepts/test-venv-isolation.md`
- `lookup/test-inventory.md`