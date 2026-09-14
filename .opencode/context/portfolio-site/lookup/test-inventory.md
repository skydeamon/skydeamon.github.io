<!-- Context: portfolio-site/lookup/test-inventory | Priority: medium | Version: 1.1 | Updated: 2026-09-13 -->

# Lookup: Test Inventory & DOM Hooks

**Core Idea**: Quick reference for the test suite — scripts, counts, and the DOM selectors each page group exposes.

## Scripts

| Command | Env | Runs | Count |
|---------|-----|------|-------|
| `npm test` | system Node | static contract + unit | 92 |
| `npm run test:unit` | system Node | unit only | 34 |
| `npm run test:integration` | `testenv/integration` | browser, local server | 48 |
| `npm run test:e2e` | `testenv/e2e` | journeys, local server | 4 |
| `npm run test:e2e:deployed` | `testenv/e2e` | journeys, live site | 4 |
| `npm run test:deployed` | system Node | asset checks, live site | 2 |

## DOM Hooks by Page Group

| Group | Theme toggle | Icon | Print | Theme target |
|-------|-------------|------|-------|--------------|
| Root `index.html` | `#theme-toggle` | `#theme-icon` (i.fas) | — | `<html data-theme>` + `localStorage['theme']` |
| Portfolio (22 pages: 10 renderer CVs, 5 cover letters, 7 audience) | `button.control-btn` | `#theme-icon` (span 🌙/☀️) | `button.control-btn.secondary` | `<html data-theme>` (in-page only) |
| ATS + minimal (4 pages: `cv_*_ats.html`, `cv_minimal.html`) | none | none | `button.print-btn` | none (no dark mode) |

## Accent Themes (`<body data-theme>`)

`general #2563eb` · `data-engineer #0d9488` · `ai-engineer #7c3aed` · `academic #1f2937` · `freelance #ea580c` · `executive #111827` · `modern #2563eb`

## Key Journeys (e2e)

Root → `a.audience-card[href="portfolio/audience/ai-engineer.html"]` → `a[href="../cv_ai_engineer.html"]` ("Full CV") → `a[href="index.html"]` (← CVs) → `a[href="../index.html"]` (Home).

**Reference**: `.opencode/context/core/standards/test-coverage.md`

**Related**:
- `concepts/test-venv-isolation.md`
- `guides/running-tests.md`