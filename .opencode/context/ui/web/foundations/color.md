<!-- Context: ui/web/foundations/color | Priority: high | Version: 1.0 | Updated: 2026-09-11 -->
# Color Palette Guidelines

## Avoid Bootstrap Blue

**Rule**: NEVER use generic Bootstrap blue (#007bff) unless explicitly requested

**Why**: Overused, lacks personality, feels dated

**Alternatives**:

```css
/* Instead of Bootstrap blue */
--bootstrap-blue: #007bff; /* ❌ Avoid */

/* Use contextual colors */
--primary: oklch(0.6489 0.2370 26.9728);    /* Vibrant orange */
--accent: oklch(0.5635 0.2408 260.8178);     /* Rich purple */
--info: oklch(0.6200 0.1900 260);            /* Modern blue */
--success: oklch(0.7323 0.2492 142.4953);    /* Fresh green */
```

## Color Usage Rules

1. **Semantic naming**: Use `--primary`, `--accent`, not `--blue`, `--red`
2. **Brand alignment**: Choose colors that match project personality
3. **Contrast testing**: Ensure WCAG AA compliance (4.5:1 minimum)
4. **Consistency**: Use theme variables throughout

## Background/Foreground Contrast

### Contrast Rule

**When designing components or posters**:

- **Light component** → Dark background
- **Dark component** → Light background

**Why**: Ensures visibility and creates visual hierarchy

**Examples**:

```html
<!-- Light card on dark background -->
<div class="bg-gray-900 p-8">
  <div class="bg-white text-gray-900 p-6 rounded-lg">
    Light card content
  </div>
</div>

<!-- Dark card on light background -->
<div class="bg-gray-50 p-8">
  <div class="bg-gray-900 text-white p-6 rounded-lg">
    Dark card content
  </div>
</div>
```

### Component-Specific Rules

**Posters/Hero Sections**:
- Use high contrast for readability
- Consider overlay gradients for text on images
- Test with actual content

**Cards/Panels**:
- Subtle elevation with shadows
- Clear boundary between card and background
- Consistent padding

**Related**: `ui/web/foundations/overview.md`, `ui/web/foundations/color-system.md`