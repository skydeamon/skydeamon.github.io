<!-- Context: ui/web/foundations/design-systems | Priority: high | Version: 1.0 | Updated: 2026-09-11 -->
# Design Systems — Overview

## Overview

This context file provides reusable design system patterns, theme templates, and color systems for frontend design work. Use these as starting points for creating cohesive, professional UI designs.

## Quick Reference

**Color Format**: OKLCH (perceptually uniform color space)
**Theme Variables**: CSS custom properties (--variable-name)
**Font Sources**: Google Fonts
**Responsive**: All designs must be mobile-first responsive

## Topics

| File | Covers |
|------|--------|
| `theme-neo-brutalism.md` | Neo-brutalism theme template |
| `theme-modern-dark.md` | Modern dark mode theme template |
| `typography-system.md` | Recommended font families, loading |
| `color-system.md` | OKLCH color space, palette rules, pairing |
| `shadow-system.md` | Shadow scales and styles |
| `spacing-system.md` | Base unit and scale |
| `radius-system.md` | Radius scales and common values |
| `usage-guidelines.md` | When to use each theme, customization |

## Usage Guidelines

### When to Use Each Theme

**Neo-Brutalism**:
- ✅ Creative/artistic projects
- ✅ Retro/vintage aesthetics
- ✅ Bold, statement-making designs
- ❌ Enterprise/corporate applications
- ❌ Accessibility-critical interfaces

**Modern Dark Mode**:
- ✅ SaaS applications
- ✅ Developer tools
- ✅ Professional dashboards
- ✅ Enterprise applications
- ✅ Accessibility-critical interfaces

### Customization

1. Start with a base theme template
2. Adjust primary/accent colors for brand
3. Modify radius for desired feel
4. Adjust shadows for depth preference
5. Test contrast ratios for accessibility

## Best Practices

✅ **Use CSS custom properties** for all theme values
✅ **Test in light and dark modes** if applicable
✅ **Validate color contrast** (WCAG AA minimum)
✅ **Use semantic color names** (--primary, not --blue)
✅ **Load fonts from Google Fonts** for reliability
✅ **Apply consistent spacing** using the spacing scale
✅ **Test responsive behavior** at all breakpoints

❌ **Don't hardcode colors** in components
❌ **Don't use generic blue** (#007bff) without reason
❌ **Don't mix color formats** (stick to OKLCH)
❌ **Don't skip contrast testing**
❌ **Don't use too many font families** (2-3 max)

## References

- [OKLCH Color Picker](https://oklch.com/)
- [Google Fonts](https://fonts.google.com/)
- [WCAG Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Tailwind CSS Colors](https://tailwindcss.com/docs/customizing-colors)

**Related**: `ui/web/foundations/overview.md`, `ui/web/navigation.md`