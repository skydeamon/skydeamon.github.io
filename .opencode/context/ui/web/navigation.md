<!-- Context: ui/web/navigation | Priority: critical | Version: 1.1 | Updated: 2026-09-11 -->

# Web UI Context

**Purpose**: Web-based UI patterns, animations, styling standards, and React component design

**Last Updated**: 2026-01-07

---

## Quick Navigation

### Core Files

| File | Description | Priority |
|------|-------------|----------|
| [animation-basics.md](animation-basics.md) | Animation fundamentals, timing, easing | high |
| [animation-components.md](animation-components.md) | Button, card, modal, dropdown animations | high |
| [animation-chat.md](animation-chat.md) | Chat UI and message animations | medium |
| [animation-loading.md](animation-loading.md) | Skeleton, spinner, progress animations | medium |
| [animation-forms.md](animation-forms.md) | Form input and validation animations | medium |
| [animation-advanced.md](animation-advanced.md) | Recipes, best practices, accessibility | medium |

### Foundations (split from ui-styling-standards, design-systems, react-patterns)

| File | Description | Priority |
|------|-------------|----------|
| [foundations/overview.md](foundations/overview.md) | Styling + design system + React patterns overview | high |
| [foundations/css-framework.md](foundations/css-framework.md) | CSS frameworks, Tailwind patterns | high |
| [foundations/responsive.md](foundations/responsive.md) | Responsive design, breakpoints | high |
| [foundations/color.md](foundations/color.md) | Color usage, dark mode | high |
| [foundations/specificity.md](foundations/specificity.md) | CSS specificity & cascade | high |
| [foundations/layout.md](foundations/layout.md) | Layout patterns | high |
| [foundations/typography.md](foundations/typography.md) | Typography standards | high |
| [foundations/components.md](foundations/components.md) | Component styling | high |
| [foundations/accessibility.md](foundations/accessibility.md) | Accessibility standards | high |
| [foundations/performance.md](foundations/performance.md) | CSS performance | medium |
| [foundations/design-systems.md](foundations/design-systems.md) | Design system principles | medium |
| [foundations/react-patterns.md](foundations/react-patterns.md) | Modern React patterns, hooks | high |
| [foundations/react-components.md](foundations/react-components.md) | React component design | high |
| [foundations/react-hooks.md](foundations/react-hooks.md) | Custom hooks patterns | high |
| [foundations/react-state.md](foundations/react-state.md) | State management | high |
| [foundations/react-performance.md](foundations/react-performance.md) | React performance optimization | medium |

### Subcategories

| Subcategory | Description | Path |
|-------------|-------------|------|
| **design/** | Advanced design patterns (scrollytelling, effects) | [design/navigation.md](design/navigation.md) |

---

## Loading Strategy

### For general web UI work:
1. Load `foundations/css-framework.md` (CSS frameworks, Tailwind)
2. Load `foundations/react-patterns.md` (component patterns)
3. Reference `animation-advanced.md` (if animations needed)

### For animation work:
1. Load `animation-basics.md` (fundamentals, timing, easing)
2. Load `animation-components.md` (UI component animations)
3. Reference `animation-chat.md` for chat UI patterns
4. Reference `animation-advanced.md` for recipes and accessibility

### For scroll animations:
1. Navigate to `design/` subcategory
2. Load scroll-linked animation guides

---

## Scope

This subcategory covers:
- ✅ CSS animations and transitions
- ✅ Tailwind CSS and utility-first styling
- ✅ React component patterns and hooks
- ✅ Design systems and component libraries
- ✅ Icon libraries and web fonts
- ✅ Scroll-linked animations (scrollytelling)
- ✅ Canvas-based rendering
- ✅ Framer Motion patterns

---

## File Summaries

### animation-basics.md, animation-components.md, animation-chat.md, animation-loading.md, animation-forms.md, animation-advanced.md
CSS animations, micro-interactions, and UI transitions split into focused modules.

**Key topics**: Animation micro-syntax, 60fps performance, reduced motion, chat UI animations, component patterns

### foundations/ (ui-styling-standards, design-systems, react-patterns)
CSS framework usage, Tailwind CSS patterns, responsive design, design system principles, and React component patterns split into focused modules.

**Key topics**: Utility-first CSS, component styling, responsive breakpoints, dark mode, design tokens, custom hooks, memoization

---

## Related Categories

- `ui/terminal/` - Terminal UI patterns
- `development/` - General development patterns

---

## Used By

**Agents**: frontend-specialist, design-specialist, ui-developer, react-developer, animation-expert

---

## Statistics
- Core files: 6 (animation)
- Foundations: 16 files
- Subcategories: 1 (design/)
- **Total context files**: 6 + 16 + design subcategory
