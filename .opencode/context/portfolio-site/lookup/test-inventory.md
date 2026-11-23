<!-- Context: portfolio-site/lookup/test-inventory | Priority: medium | Version: 1.4 | Updated: 2026-11-23 -->

# Lookup: Test Inventory & DOM Hooks

**Core Idea**: Quick reference for the test suite — scripts, counts, and the DOM selectors each page group exposes.

## Scripts

| Command | Env | Runs | Count |
|---------|-----|------|-------|
| `npm test` | system Node | static contract + unit + audit | 255 |
| `npm run test:unit` | system Node | unit only | 57 |
| `npm run test:coverage` | system Node | node suite + coverage thresholds | 255 |
| `npm run test:integration` | `testenv/integration` | browser, local server | 142 |
| `npm run test:e2e` | `testenv/e2e` | journeys, local server | 9 |
| `npm run test:e2e:deployed` | `testenv/e2e` | journeys, live site | 9 |
| `npm run test:deployed` | system Node | asset, PDF, content-type checks, live site | 6 |
| `npm run audit:spell` | system Node | hunspell spellcheck | — |

CI (`.github/workflows/tests.yml`) runs the Node, coverage, integration, E2E, and spell gates. Coverage thresholds: 99% lines, 99% functions, 80% branches.

## DOM Hooks by Page Group

| Group | Theme toggle | Icon | Print | Theme target |
|-------|-------------|------|-------|--------------|
| Root `index.html` | `#theme-toggle` | `#theme-icon` (i.fas) | — | `<html data-theme>` + `localStorage['theme']` |
| Portfolio (55 pages: 18 CVs in `cv/`, 11 engagement in `cv/engagement/`, 13 audience in `audience/`, 12 cover letters in `cover-letters/`, 1 hub) | `button.control-btn` | `#theme-icon` (span 🌙/☀️) | `button.control-btn.secondary` | `<html data-theme>` + `localStorage['theme']` (persisted via `js/theme-store.js`) |
| Engagement (11 pages in `cv/engagement/`) | none | none | `button.control-btn.secondary#print-btn` | `<html data-theme>` (stored/system preference) + `<body data-theme>` (accent via cv-minimal.css mapping) |

## Accent Themes (`<body data-theme>`)

`general #2563eb` · `data-engineer #0d9488` · `ai-engineer #7c3aed` · `academic #1f2937` · `freelance #ea580c` · `executive #111827` · `modern #2563eb`

## Key Journeys (e2e)

Root → `a.audience-card[href="portfolio/audience/ai-engineer.html"]` → `a[href="../cv/ai-engineer.html"]` ("Full CV") → `a[href="../index.html"]` (← CVs) → `a[href="../../index.html"]` (Home).

Root → `a[href="portfolio/index.html"]` (hub) → `a.cv-card[href="cv/platform-engineer.html"]` → certificate links at `../../certificates/*.pdf`; engagement shells use `../../../certificates/*.pdf`.

Certificate PDFs are checked three ways: data → on-disk existence (`tests/certifications.test.js`), generated-href resolution for every CV shell (`tests/rendered-links.test.js`), and live response/content-type (`tests/deployed/deployed.test.js`).

**Reference**: `.opencode/context/core/standards/test-coverage.md`

**Related**:
- `concepts/test-venv-isolation.md`
- `guides/running-tests.md`