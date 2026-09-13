<!-- Context: ui/web/foundations/radius-system | Priority: high | Version: 1.0 | Updated: 2026-09-11 -->
# Border Radius System

## Radius Scales

```css
--radius-sm: calc(var(--radius) - 4px);
--radius-md: calc(var(--radius) - 2px);
--radius-lg: var(--radius);
--radius-xl: calc(var(--radius) + 4px);
```

## Common Values

- **Sharp** (Neo-brutalism): `--radius: 0px`
- **Subtle** (Modern): `--radius: 0.375rem` (6px)
- **Rounded** (Friendly): `--radius: 0.625rem` (10px)
- **Pill** (Buttons): `--radius: 9999px`

**Related**: `ui/web/foundations/design-systems.md`