<!-- Context: ui/web/foundations/shadow-system | Priority: high | Version: 1.0 | Updated: 2026-09-11 -->
# Shadow System

## Shadow Scales

Shadows create depth and hierarchy:

- `--shadow-2xs`: Minimal elevation (1-2px)
- `--shadow-xs`: Subtle lift (2-3px)
- `--shadow-sm`: Small cards (3-4px)
- `--shadow`: Default elevation (4-6px)
- `--shadow-md`: Medium cards (6-8px)
- `--shadow-lg`: Modals, dropdowns (8-12px)
- `--shadow-xl`: Floating panels (12-16px)
- `--shadow-2xl`: Maximum elevation (16-24px)

## Shadow Styles

**Soft Shadows** (Modern):
```css
box-shadow: 0 1px 3px 0px hsl(0 0% 0% / 0.10);
```

**Hard Shadows** (Neo-brutalism):
```css
box-shadow: 4px 4px 0px 0px hsl(0 0% 0% / 1.00);
```

**Related**: `ui/web/foundations/design-systems.md`