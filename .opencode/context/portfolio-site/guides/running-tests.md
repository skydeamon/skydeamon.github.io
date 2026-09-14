<!-- Context: portfolio-site/guides/running-tests | Priority: high | Version: 1.1 | Updated: 2026-09-13 -->

# Guide: Running the Test Pyramid

**Core Idea**: Four tiers — static/contract, unit, integration (browser + local server), e2e (full journeys). All runnable from the repo root.

**Steps**:
1. **Provision venvs** (once, idempotent): `npm run venv:setup`
   - If Linux headless libs missing: `sudo npx --prefix testenv/integration playwright install-deps chromium`
2. **Static + unit** (no browser): `npm test` → 92 tests (58 static contract + 34 unit)
3. **Integration** (local server, auto-started): `npm run test:integration` → 48 tests
4. **E2E** (local server): `npm run test:e2e` → 4 journeys
5. **Deployed** (after push): wait for GitHub Pages rebuild, then:
   - `npm run test:e2e:deployed` (same journeys vs live site)
   - `npm run test:deployed` (static asset checks vs live site)

**Known Product Limitation**: portfolio pages do **not** persist theme (inline JS, no `localStorage`) — tests assert in-page toggle only, never cross-page persistence on portfolio pages.

**Quick Reference**:
```bash
npm test                  # static + unit
npm run test:integration  # browser, local
npm run test:e2e          # journeys, local
npm run test:e2e:deployed # journeys, live
npm run test:deployed     # asset checks, live
```

**Reference**: `.opencode/context/core/standards/test-coverage.md`

**Related**:
- `concepts/test-venv-isolation.md`
- `lookup/test-inventory.md`