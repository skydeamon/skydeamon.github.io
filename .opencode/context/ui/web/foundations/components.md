<!-- Context: ui/web/foundations/components | Priority: high | Version: 1.0 | Updated: 2026-09-11 -->
# Component Styling Patterns

## Buttons

```html
<!-- Primary button -->
<button class="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity">
  Primary Action
</button>

<!-- Secondary button -->
<button class="bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:bg-secondary/80 transition-colors">
  Secondary Action
</button>

<!-- Outline button -->
<button class="border-2 border-primary text-primary px-6 py-3 rounded-lg font-medium hover:bg-primary hover:text-primary-foreground transition-all">
  Outline Action
</button>
```

## Cards

```html
<!-- Basic card -->
<div class="bg-card text-card-foreground rounded-lg shadow-md p-6">
  <h3 class="text-xl font-semibold mb-2">Card Title</h3>
  <p class="text-muted-foreground">Card content</p>
</div>

<!-- Interactive card -->
<div class="bg-card text-card-foreground rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
  <h3 class="text-xl font-semibold mb-2">Interactive Card</h3>
  <p class="text-muted-foreground">Hover for effect</p>
</div>
```

## Forms

```html
<!-- Input field -->
<div class="space-y-2">
  <label class="block text-sm font-medium">Email</label>
  <input 
    type="email" 
    class="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
    placeholder="you@example.com"
  >
</div>

<!-- Textarea -->
<div class="space-y-2">
  <label class="block text-sm font-medium">Message</label>
  <textarea 
    class="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all resize-none"
    rows="4"
    placeholder="Your message..."
  ></textarea>
</div>
```

**Related**: `ui/web/foundations/overview.md`