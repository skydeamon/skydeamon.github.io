<!-- Context: ui/web/foundations/performance | Priority: high | Version: 1.0 | Updated: 2026-09-11 -->
# Performance Optimization

## CSS Loading

```html
<!-- Preconnect to font sources -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- Preload critical fonts -->
<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
```

## Image Optimization

```html
<!-- Responsive images -->
<img 
  src="image-800.jpg" 
  srcset="image-400.jpg 400w, image-800.jpg 800w, image-1200.jpg 1200w"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  alt="Description"
  loading="lazy"
>
```

## Critical CSS

```html
<!-- Inline critical CSS -->
<style>
  /* Above-the-fold styles */
  body { margin: 0; font-family: system-ui; }
  .hero { min-height: 100vh; }
</style>

<!-- Load full CSS async -->
<link rel="stylesheet" href="styles.css" media="print" onload="this.media='all'">
```

**Related**: `ui/web/foundations/overview.md`