<!-- Context: portfolio-site/errors/css-cascade-dark-mode | Priority: critical | Version: 1.0 | Updated: 2026-09-11 -->

# Error: Portfolio Dark Mode Has No Visible Effect

**Symptom**: On portfolio pages, the dark-mode toggle flips `<html data-theme="dark">` and the icon, but colors never change.

**Cause**: In `css/portfolio.css`, `[data-theme="dark"]` was ordered **before** `[data-theme="light"], :root`. Both selectors have equal specificity (0,1,0) and match `<html>`; the later `:root` (light vars) always wins the cascade.

**Fix**: Move the `[data-theme="dark"]` block **after** `[data-theme="light"], :root` (matching `css/main.css`). Regression guard added in `tests/css-consolidation.test.js` (asserts dark index > light index).

**Prevention**:
- Keep same-specificity attribute rules ordered dark-after-light
- `main.css` was already correct; `portfolio.css` (renamed from `shared_styles.css`) carried the bug

**Quick Check**:
```bash
grep -n '\[data-theme=' css/portfolio.css
# [data-theme="light"], :root must appear BEFORE [data-theme="dark"]
```

**Reference**: `.opencode/context/ui/web/foundations/specificity.md` (specificity & cascade)

**Related**:
- `lookup/test-inventory.md` — integration test asserting computed colors change