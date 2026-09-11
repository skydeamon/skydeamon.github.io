<!-- Context: portfolio-site/concepts/umd-pure-logic-extraction | Priority: high | Version: 1.0 | Updated: 2026-09-11 -->

# Concept: UMD Pure-Logic Extraction

**Core Idea**: Split browser scripts into a pure-logic module (unit-testable) + a DOM-wiring shell. `js/site-logic.js` holds pure functions; `js/app.js` only wires them to the DOM.

**Key Points**:
- Pure functions: `getInitialTheme(stored, systemDark)` → `'dark' | 'light' | null`; `computeNextTheme(current)` → flips; `themeIconClass(isDark)` → `'fas fa-sun' | 'fas fa-moon'`
- UMD wrapper: `module.exports` for Node, `window.SiteLogic` for the browser; loaded via `<script src="./js/site-logic.js">` **before** `app.js`
- Unit-tested with `node:test` in `tests/unit/site-logic.test.js` (AAA pattern)
- Refactor is behavior-preserving: verified by existing static tests + Playwright integration tests
- Golden rule: *"If you can't test it easily, refactor it"*

**Quick Example**:
```js
// js/site-logic.js (UMD)
function computeNextTheme(current) {
  return current === 'dark' ? 'light' : 'dark';
}
// app.js consumes it:
const next = SiteLogic.computeNextTheme(root.getAttribute('data-theme'));
```

**Reference**: `.opencode/context/core/standards/code-quality.md` (pure functions, composition)

**Related**:
- `lookup/test-inventory.md` — unit test coverage
- `guides/running-tests.md` — how to run the unit suite