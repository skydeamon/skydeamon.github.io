<!-- Context: ui/web/foundations/overview | Priority: high | Version: 1.0 | Updated: 2026-09-11 -->
# UI Styling Standards — Overview

## Overview

Standards and conventions for CSS frameworks, responsive design, and styling best practices in frontend development.

## Quick Reference

**Framework**: Tailwind CSS + Flowbite (default)
**Approach**: Mobile-first responsive
**Format**: Utility-first CSS
**Specificity**: Use `!important` for overrides when needed

## Topics

| File | Covers |
|------|--------|
| `css-framework.md` | Tailwind CSS + Flowbite loading and usage |
| `responsive.md` | Mobile-first breakpoints, testing requirements |
| `color.md` | Color palette, contrast rules, component-specific rules |
| `specificity.md` | `!important` usage, specificity best practices |
| `layout.md` | Flexbox, grid, container patterns |
| `typography.md` | Hierarchy, font loading, readability |
| `components.md` | Buttons, cards, forms styling |
| `accessibility.md` | ARIA labels, semantic HTML, focus states |
| `performance.md` | CSS loading, image optimization, critical CSS |

## Best Practices

### Do's ✅

- Use Tailwind utility classes for rapid development
- Load Tailwind via script tag for JIT compilation
- Use Flowbite as default component library
- Ensure all designs are mobile-first responsive
- Test at multiple breakpoints
- Use semantic HTML elements
- Provide ARIA labels for interactive elements
- Use CSS custom properties for theming
- Apply `!important` for framework overrides
- Ensure proper color contrast (WCAG AA)

### Don'ts ❌

- Don't use Bootstrap blue without explicit request
- Don't load Tailwind as a stylesheet
- Don't skip responsive design
- Don't use div soup (use semantic HTML)
- Don't forget focus states
- Don't hardcode colors (use theme variables)
- Don't skip accessibility testing
- Don't use tiny touch targets (<44px)
- Don't mix color formats
- Don't over-use `!important`

## Framework Alternatives

If user requests a different framework:

**Bootstrap**:
```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
```

**Bulma**:
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css">
```

**Foundation**:
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/foundation-sites@6.7.5/dist/css/foundation.min.css">
<script src="https://cdn.jsdelivr.net/npm/foundation-sites@6.7.5/dist/js/foundation.min.js"></script>
```

## References

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Flowbite Components](https://flowbite.com/docs/getting-started/introduction/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Web Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

**Related**: `ui/web/foundations/design-systems.md`, `ui/web/navigation.md`