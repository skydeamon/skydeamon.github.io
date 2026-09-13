<!-- Context: ui/web/foundations/color-system | Priority: high | Version: 1.0 | Updated: 2026-09-11 -->
# Color System Guidelines

## OKLCH Color Space

Use OKLCH for perceptually uniform colors:
- **L** (Lightness): 0-1 (0 = black, 1 = white)
- **C** (Chroma): 0-0.4 (saturation)
- **H** (Hue): 0-360 (color angle)

**Format**: `oklch(L C H)`

**Example**: `oklch(0.6489 0.2370 26.9728)` = vibrant orange

## Color Palette Rules

1. **Avoid Bootstrap Blue**: Unless explicitly requested, avoid generic blue (#007bff)
2. **Semantic Colors**: Use meaningful color names (--primary, --destructive, --success)
3. **Contrast**: Ensure WCAG AA compliance (4.5:1 for text)
4. **Consistency**: Use theme variables, not hardcoded colors

## Background/Foreground Pairing

**Rule**: Background should contrast with content

- Light component → Dark background
- Dark component → Light background
- Ensures visibility and visual hierarchy

**Related**: `ui/web/foundations/design-systems.md`, `ui/web/foundations/color.md`