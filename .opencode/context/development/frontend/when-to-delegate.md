<!-- Context: development/frontend/when-to-delegate | Priority: high | Version: 1.0 | Updated: 2026-09-11 -->
# When to Delegate to Frontend Specialist

**Purpose**: Clear decision criteria for when to delegate frontend/UI work to the **frontend-specialist** subagent vs. handling it directly.

## Quick Reference

**Delegate when**: UI/UX design work (wireframes, themes, animations), design system implementation, complex responsive layouts, animation/micro-interactions, visual design iterations.

**Handle directly when**: Simple HTML/CSS edits, single component updates, bug fixes in existing UI, minor styling tweaks.

## Decision Matrix

### ✅ DELEGATE to Frontend-Specialist

| Scenario | Why Delegate |
|----------|--------------|
| New UI design from scratch | Needs staged workflow (layout → theme → animation → implement) |
| Design system work | Requires ContextScout for standards, ExternalScout for UI libs |
| Complex responsive layouts | Needs mobile-first approach across breakpoints |
| Animation implementation | Requires animation patterns, performance optimization |
| Multi-stage design iterations | Needs versioning (design_iterations/ folder) |
| Theme creation | Requires OKLCH colors, CSS custom properties |
| Component library integration | Needs ExternalScout for current docs (Flowbite, Radix, etc.) |
| Accessibility-focused UI | Requires WCAG compliance, ARIA attributes |

### ⚠️ HANDLE DIRECTLY (Don't Delegate)

| Scenario | Why Direct |
|----------|------------|
| Simple HTML edits | Single file, straightforward change |
| Minor CSS tweaks | Small styling adjustment |
| Bug fixes | Fixing existing code, not creating new design |
| Content updates | Changing text, images, or data |
| Single component updates | Modifying one existing component |
| Quick prototypes | Throwaway code for testing |

## Delegation Checklist

- [ ] Task is UI/design focused (not backend, logic, or data)
- [ ] Task requires design expertise (layout, theme, animations)
- [ ] Task benefits from staged workflow (layout → theme → animation → implement)
- [ ] Task needs context discovery (design systems, UI libraries, standards)
- [ ] User has approved the approach (never delegate before approval)

## How to Delegate

1. **Discover Context** (optional): Call ContextScout for design system standards, UI component patterns, animation guidelines.
2. **Propose Approach**: Present plan to user — task, approach (delegate), why, context needed.
3. **Get Approval**: Wait for explicit user approval before delegating.
4. **Delegate with Context**:

```javascript
task(
  subagent_type="frontend-specialist",
  description="Create landing page design",
  prompt="Context to load:
  - .opencode/context/ui/web/foundations/design-systems.md
  - .opencode/context/ui/web/foundations/css-framework.md
  - .opencode/context/ui/web/foundations/typography-system.md
  
  Task: Create a landing page with hero, features grid, CTA.
  Requirements: Tailwind CSS + Flowbite, mobile-first, animations <400ms.
  Follow your staged workflow (layout → theme → animation → implement).
  Request approval between each stage."
)
```

For complex delegation, create a session context file first, then delegate with session path.

## Red Flags (Don't Delegate)

❌ User just wants a quick fix → handle directly
❌ Task is backend/logic focused → wrong subagent
❌ Single line change → handle directly
❌ Content update → handle directly
❌ Testing/validation → wrong subagent (use tester)
❌ Code review → wrong subagent (use reviewer)

## Green Flags (Delegate)

✅ New UI design → delegate
✅ Design systems → delegate
✅ Responsive layouts → delegate
✅ Animations → delegate
✅ UI library integration → delegate
✅ Staged workflow benefit → delegate
✅ Design expertise required → delegate

## Frontend-Specialist Capabilities

**Does well**: complete UI designs from scratch, design systems (Tailwind, Shadcn, Flowbite), responsive layouts, animations/micro-interactions, UI component libraries, OKLCH themes, staged workflow, design versioning.

**Doesn't do**: backend logic/API integration, database queries, testing/validation, code review/refactoring, simple HTML/CSS edits (overkill), content updates.

## Best Practices

### Do's ✅
- Propose before delegating — show user the plan first
- Get approval — never delegate without user sign-off
- Provide context — list context files the subagent should load
- Set clear requirements — design system, breakpoints, animations
- Use staged workflow — let frontend-specialist follow its process
- Trust the specialist — it knows design patterns and best practices

### Don'ts ❌
- Don't delegate simple edits — handle directly for efficiency
- Don't skip approval — always get user sign-off first
- Don't delegate backend work — wrong subagent
- Don't micromanage — let the specialist follow its workflow
- Don't delegate without context — provide context files to load
- Don't delegate bug fixes — handle directly unless it's a design issue

**Related**: `core/workflows/task-delegation-basics.md`, `ui/web/foundations/design-systems.md`, `ui/web/foundations/css-framework.md`