<!-- Context: ui/web/foundations/typography | Priority: high | Version: 1.0 | Updated: 2026-09-11 -->
# Typography Standards

## Hierarchy

```html
<!-- Heading scale -->
<h1 class="text-4xl md:text-5xl lg:text-6xl font-bold">Main Heading</h1>
<h2 class="text-3xl md:text-4xl font-semibold">Section Heading</h2>
<h3 class="text-2xl md:text-3xl font-semibold">Subsection</h3>
<h4 class="text-xl md:text-2xl font-medium">Minor Heading</h4>

<!-- Body text -->
<p class="text-base md:text-lg leading-relaxed">Body text</p>
<p class="text-sm text-gray-600">Secondary text</p>
<p class="text-xs text-gray-500">Caption text</p>
```

## Font Loading

**Always use Google Fonts**:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

**Apply in CSS**:

```css
body {
  font-family: 'Inter', sans-serif !important;
}
```

## Readability

- **Line length**: 60-80 characters optimal
- **Line height**: 1.5-1.75 for body text
- **Font size**: Minimum 16px for body text
- **Contrast**: 4.5:1 minimum for normal text

**Related**: `ui/web/foundations/overview.md`, `ui/web/foundations/typography-system.md`