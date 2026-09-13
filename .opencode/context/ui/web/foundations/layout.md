<!-- Context: ui/web/foundations/layout | Priority: high | Version: 1.0 | Updated: 2026-09-11 -->
# Layout Patterns

## Flexbox (Preferred for 1D layouts)

```html
<!-- Horizontal layout -->
<div class="flex items-center gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<!-- Vertical layout -->
<div class="flex flex-col gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<!-- Centered content -->
<div class="flex items-center justify-center min-h-screen">
  <div>Centered content</div>
</div>
```

## Grid (Preferred for 2D layouts)

```html
<!-- Responsive grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div>Card 1</div>
  <div>Card 2</div>
  <div>Card 3</div>
</div>

<!-- Dashboard layout -->
<div class="grid grid-cols-12 gap-4">
  <aside class="col-span-12 lg:col-span-3">Sidebar</aside>
  <main class="col-span-12 lg:col-span-9">Content</main>
</div>
```

## Container Patterns

```html
<!-- Centered container with max width -->
<div class="container mx-auto px-4 max-w-7xl">
  Content
</div>

<!-- Full-width section with contained content -->
<section class="w-full bg-gray-50">
  <div class="container mx-auto px-4 py-12 max-w-6xl">
    Content
  </div>
</section>
```

**Related**: `ui/web/foundations/overview.md`