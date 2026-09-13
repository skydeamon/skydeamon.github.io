<!-- Context: ui/web/foundations/accessibility | Priority: high | Version: 1.0 | Updated: 2026-09-11 -->
# Accessibility Standards

## ARIA Labels

```html
<!-- Button with icon -->
<button aria-label="Close dialog">
  <svg>...</svg>
</button>

<!-- Navigation -->
<nav aria-label="Main navigation">
  <ul>...</ul>
</nav>
```

## Semantic HTML

```html
<!-- ✅ Use semantic elements -->
<header>...</header>
<nav>...</nav>
<main>...</main>
<article>...</article>
<aside>...</aside>
<footer>...</footer>

<!-- ❌ Avoid div soup -->
<div class="header">...</div>
<div class="nav">...</div>
<div class="main">...</div>
```

## Focus States

```css
/* Always provide visible focus states */
button:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
}

/* Tailwind utility */
<button class="focus:ring-2 focus:ring-ring focus:ring-offset-2">
  Button
</button>
```

**Related**: `ui/web/foundations/overview.md`