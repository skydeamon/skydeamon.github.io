# skydeamon.github.io

Personal portfolio site for **Jade Makwela** — Senior Data Engineer · AI/LLM Practitioner · Full Stack Developer.

**Live site**: https://skydeamon.github.io/

## Structure

```
├── index.html                 # Landing page (homepage refocus: hero, pillars, impact band, curated work, audience cards)
├── css/                       # main.css, portfolio.css, themes.css, portfolio-hub.css, cv-minimal.css
├── js/                        # app.js, theme-store.js, theme.js, cv-data.js, cv-render.js, cv-init.js
├── portfolio/                 # 55 pages: hub, cv/, cv/engagement/, cover-letters/, audience/
├── certificates/              # Linked certificate PDFs
├── fontawesome/               # Vendored icon assets
├── images/
├── testenv/                   # Isolated test environments (unit/integration/e2e)
└── tests/                     # Static contract, unit, integration, e2e, deployed specs
```

## Theming

- **Root pages** (`index.html`): dark/light toggle via `#theme-toggle`, persisted in `localStorage['theme']`.
- **Portfolio pages**: 7 accent themes via `<body data-theme>` (`general`, `data-engineer`, `ai-engineer`, `academic`, `freelance`, `executive`, `modern`); dark mode persisted in `localStorage['theme']` via `js/theme-store.js`.
- **`cv/engagement/` pages** (`minimal.html`, `contract.html`, `full-time.html`, `part-time.html`, plus 7 profile shells): flat, print-ready CVs rendered from cv-data via cv-render; dark mode follows the stored/system preference.

## Testing

The repo root is **zero-dependency** — all test tooling lives in isolated venvs under `testenv/` (see `.opencode/context/portfolio-site/` for the full architecture).

| Command | What it runs | Count |
|---------|-------------|-------|
| `npm run venv:setup` | Provision venvs + Chromium (idempotent) | — |
| `npm test` | Static contract + unit + audit (`node:test`) | 255 |
| `npm run test:unit` | Unit tests only (`node:test`) | 57 |
| `npm run test:coverage` | Node suite with coverage thresholds | 255 |
| `npm run test:integration` | Browser tests vs local server (Playwright) | 142 |
| `npm run test:e2e` | Full user journeys vs local server | 9 |
| `npm run test:e2e:deployed` | Journeys vs live site (after Pages rebuild) | 9 |
| `npm run test:deployed` | Asset + certificate checks vs live site | 6 |
| `npm run audit:spell` | hunspell spellcheck over site content | — |
| `npm run test:all` | Node, integration, E2E, and spell gate | — |

CI runs the Node, coverage, integration, E2E, and spell gates on every push and PR in `.github/workflows/tests.yml`. The coverage gate is 99% lines, 99% functions, and 80% branches.

### Quick start

```bash
npm run venv:setup          # once: installs @playwright/test into testenv/, Chromium into testenv/browsers/
npm test                    # static + unit
npm run test:coverage       # node suite + coverage gate
npm run test:integration    # browser, local server (auto-started)
npm run test:e2e            # journeys, local server
npm run test:all            # full local gate before merging
```

If Linux headless browser libs are missing:

```bash
sudo npx --prefix testenv/integration playwright install-deps chromium
```

## Deployment

Push to `main` → GitHub Pages rebuilds automatically. After the rebuild completes, verify the live site:

```bash
npm run test:e2e:deployed
npm run test:deployed
```

## Context

Project context (standards, test architecture, known errors) lives in `.opencode/context/portfolio-site/` — start at `navigation.md`.