<!-- Context: portfolio-site/concepts/umd-pure-logic-extraction | Priority: high | Version: 1.1 | Updated: 2026-11-23 -->

# Concept: UMD Pure-Logic Extraction

**Core Idea**: Keep theme decisions in one pure-logic module (`js/theme-store.js`) and let browser files (`app.js`, `theme.js`, `cv-render.js`) only wire it to the DOM. One implementation prevents callers from drifting — the old per-page copies disagreed on validation and could apply an unknown value like `"neon"`.

**Key Points**:
- Pure functions: `isValid(theme)`, `readStoredTheme()`, `writeStoredTheme(theme)`, `resolveInitialTheme(storedTheme, systemDark)`, `computeNextTheme(current)`, `iconClass(isDark)`
- `applyInitialTheme(doc)` applies the resolved theme to `<html data-theme>` before first paint
- UMD wrapper: `module.exports` for Node, `window.ThemeStore` for the browser; loaded in `<head>` **before every stylesheet** so the first paint has the right tokens
- Consumers assume nothing: a missing `ThemeStore` leaves the toggle inert rather than throwing mid-handler
- Unit-tested with `node:test` through `createHarness()` in `tests/app-js.test.js`, `tests/unit/cv-render.test.js`, and `tests/unit/init-cv.test.js`
- Golden rule: *"If you can't test it easily, refactor it"*

**Quick Example**:
```js
// js/theme-store.js (UMD)
function computeNextTheme(current) {
  return current === 'dark' ? 'light' : 'dark';
}

// app.js / theme.js / cv-render.js consume the same implementation:
const next = window.ThemeStore.computeNextTheme(root.getAttribute('data-theme'));
window.ThemeStore.writeStoredTheme(next);
root.setAttribute('data-theme', next);
```

**Reference**: `.opencode/context/core/standards/code-quality.md` (pure functions, composition)

**Related**:
- `lookup/test-inventory.md` — unit test coverage
- `guides/running-tests.md` — how to run the unit suite
