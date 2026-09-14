# skydeamon.github.io

Personal portfolio site for **Jade Makwela** — Senior Data Engineer · AI/LLM Practitioner · Full Stack Developer.

**Live site**: https://skydeamon.github.io/

## Structure

```
├── index.html                 # Landing page (theme toggle + audience cards)
├── css/                       # main.css, portfolio.css, themes.css, portfolio-hub.css, cv-minimal.css
├── js/                        # app.js (DOM wiring), site-logic.js (pure logic, UMD)
├── portfolio/                 # 27 pages: hub, audience/, CVs, cover letters
├── fontawesome/               # Vendored icon assets
├── images/
├── testenv/                   # Isolated test environments (unit/integration/e2e)
└── tests/                     # Static contract, unit, integration, e2e, deployed specs
```

## Theming

- **Root pages** (`index.html`): dark/light toggle via `#theme-toggle`, persisted in `localStorage['theme']`.
- **Portfolio pages**: 7 accent themes via `<body data-theme>` (`general`, `data-engineer`, `ai-engineer`, `academic`, `freelance`, `executive`, `modern`); dark mode toggles in-page only.
- **`cv_minimal.html`**: no dark mode, print-only.

## Testing

The repo root is **zero-dependency** — all test tooling lives in isolated venvs under `testenv/` (see `.opencode/context/portfolio-site/` for the full architecture).

| Command | What it runs | Count |
|---------|-------------|-------|
| `npm run venv:setup` | Provision venvs + Chromium (idempotent) | — |
| `npm test` | Static contract + unit (`node:test`) | 92 |
| `npm run test:integration` | Browser tests vs local server (Playwright) | 48 |
| `npm run test:e2e` | Full user journeys vs local server | 4 |
| `npm run test:e2e:deployed` | Journeys vs live site (after Pages rebuild) | 4 |
| `npm run test:deployed` | Asset checks vs live site | 2 |

### Quick start

```bash
npm run venv:setup          # once: installs @playwright/test into testenv/, Chromium into testenv/browsers/
npm test                    # static + unit
npm run test:integration    # browser, local server (auto-started)
npm run test:e2e            # journeys, local server
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