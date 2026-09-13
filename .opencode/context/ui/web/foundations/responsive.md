<!-- Context: ui/web/foundations/responsive | Priority: high | Version: 1.0 | Updated: 2026-09-11 -->
# Responsive Design Requirements

## Mobile-First Approach

**Rule**: ALL designs MUST be responsive

**Breakpoints** (Tailwind defaults):

```css
/* Mobile first - base styles apply to mobile */
.element { }

/* Small devices (640px and up) */
@media (min-width: 640px) { }  /* sm: */

/* Medium devices (768px and up) */
@media (min-width: 768px) { }  /* md: */

/* Large devices (1024px and up) */
@media (min-width: 1024px) { } /* lg: */

/* Extra large devices (1280px and up) */
@media (min-width: 1280px) { } /* xl: */

/* 2XL devices (1536px and up) */
@media (min-width: 1536px) { } /* 2xl: */
```

**Tailwind Syntax**:

```html
<!-- Mobile: stack, Desktop: side-by-side -->
<div class="flex flex-col md:flex-row">
  <div class="w-full md:w-1/2">Left</div>
  <div class="w-full md:w-1/2">Right</div>
</div>

<!-- Mobile: full width, Desktop: constrained -->
<div class="w-full lg:w-3/4 xl:w-1/2 mx-auto">
  Content
</div>
```

## Testing Requirements

✅ Test at minimum breakpoints: 375px, 768px, 1024px, 1440px
✅ Verify touch targets (min 44x44px)
✅ Check text readability at all sizes
✅ Ensure images scale properly
✅ Test navigation on mobile

**Related**: `ui/web/foundations/overview.md`