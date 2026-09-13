<!-- Context: ui/web/foundations/specificity | Priority: high | Version: 1.0 | Updated: 2026-09-11 -->
# CSS Specificity & Overrides

## Using !important

**Rule**: Use `!important` for properties that might be overwritten by Tailwind or Flowbite

**Common Cases**:

```css
/* Typography overrides */
h1 {
  font-size: 2.5rem !important;
  font-weight: 700 !important;
  line-height: 1.2 !important;
}

body {
  font-family: 'Inter', sans-serif !important;
  color: var(--foreground) !important;
}

/* Component overrides */
.custom-button {
  background-color: var(--primary) !important;
  border-radius: var(--radius) !important;
}
```

**When NOT to use**:

```css
/* ❌ Don't use for everything */
.element {
  margin: 1rem !important;
  padding: 1rem !important;
  display: flex !important;
}

/* ✅ Use Tailwind utilities instead */
<div class="m-4 p-4 flex">
```

## Specificity Best Practices

1. **Prefer utility classes** over custom CSS
2. **Use !important sparingly** - only for framework overrides
3. **Scope custom styles** to avoid conflicts
4. **Use CSS custom properties** for theming

**Related**: `ui/web/foundations/overview.md`