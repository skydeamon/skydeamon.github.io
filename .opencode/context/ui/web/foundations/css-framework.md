<!-- Context: ui/web/foundations/css-framework | Priority: high | Version: 1.0 | Updated: 2026-09-11 -->
# CSS Framework Conventions

## Tailwind CSS

**Loading Method** (Preferred):

```html
<!-- ✅ Use CDN script tag -->
<script src="https://cdn.tailwindcss.com"></script>
```

**Avoid**:

```html
<!-- ❌ Don't use stylesheet link -->
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
```

**Why**: Script tag allows for JIT compilation and configuration

## Flowbite

**Loading Method**:

```html
<!-- Flowbite CSS -->
<link href="https://cdn.jsdelivr.net/npm/flowbite@2.0.0/dist/flowbite.min.css" rel="stylesheet">

<!-- Flowbite JS -->
<script src="https://cdn.jsdelivr.net/npm/flowbite@2.0.0/dist/flowbite.min.js"></script>
```

**Usage**: Flowbite is the default component library unless user specifies otherwise

**Components Available**:
- Buttons, forms, modals
- Navigation, dropdowns, tabs
- Cards, alerts, badges
- Tables, pagination
- Tooltips, popovers

**Related**: `ui/web/foundations/overview.md`