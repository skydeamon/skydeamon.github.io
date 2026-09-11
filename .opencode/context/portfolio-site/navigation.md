<!-- Context: portfolio-site/navigation | Priority: high | Version: 1.0 | Updated: 2026-09-11 -->

# Portfolio Site (Jade Makwela)

> Context for the static portfolio site at `skydeamon.github.io` — structure, theming, and the test pyramid.

## Structure

```
.opencode/context/portfolio-site/
├── navigation.md              # This file
├── concepts/                  # Architecture & patterns
├── errors/                    # Known bugs & gotchas
├── guides/                    # How-to workflows
└── lookup/                    # Quick reference data
```

## Quick Routes

| What You Need | File |
|---------------|------|
| Test env architecture | `concepts/test-venv-isolation.md` |
| Pure-logic extraction pattern | `concepts/umd-pure-logic-extraction.md` |
| Dark-mode cascade bug | `errors/css-cascade-dark-mode.md` |
| Playwright venv gotchas | `errors/playwright-venv-setup.md` |
| Run the test pyramid | `guides/running-tests.md` |
| Scripts, counts, DOM hooks | `lookup/test-inventory.md` |

## Related

- `core/standards/code-quality.md` — pure functions, modular design
- `core/standards/test-coverage.md` — AAA, what to test
- `ui/web/ui-styling-standards.md` — CSS specificity & theming