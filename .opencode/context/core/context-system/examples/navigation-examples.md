<!-- Context: core/context-system/examples/navigation-examples| Priority: high | Version: 1.0 | Updated: 2026-09-11 -->

# Examples: Navigation Files

**Purpose**: Real-world examples of good navigation files

---

## Example 1: Category Navigation (Function-Based)

**Pattern**: Repository-specific, function-based

```markdown
# OpenAgents Control Repository Navigation

**Purpose**: Navigate OpenAgents Control repository context

---

## Structure

```
openagents-repo/
├── navigation.md
├── quick-start.md
├── core-concepts/
│   ├── agent-architecture.md
│   ├── eval-framework.md
│   └── registry-system.md
├── guides/
│   ├── adding-agent.md
│   ├── testing-agent.md
│   └── debugging-issues.md
├── lookup/
│   ├── commands.md
│   └── file-locations.md
└── errors/
    └── tool-permission-errors.md
```

---

## Quick Routes

| Task | Path |
|------|------|
| **New here** | `quick-start.md` |
| **Add agent** | `guides/adding-agent.md` |
| **Debug issue** | `guides/debugging-issues.md` |
| **Find files** | `lookup/file-locations.md` |
| **Fix error** | `errors/tool-permission-errors.md` |

---

## By Type

**Core Concepts** → Foundational understanding
**Guides** → Step-by-step workflows
**Lookup** → Quick reference tables
**Errors** → Troubleshooting
```

**Why**: Token-efficient (~250), ASCII tree + quick routes + type-based organization

---

## Example 2: Category Navigation (Concern-Based)

**Pattern**: Multi-technology, concern-based

```markdown
# Development Navigation

**Purpose**: Software development across all stacks

---

## Structure

```
development/
├── navigation.md
├── ui-navigation.md           # Specialized
├── backend-navigation.md      # Specialized
├── principles/
│   ├── clean-code.md
│   └── api-design/
├── frontend/
│   ├── react/
│   └── vue/
├── backend/
│   ├── api-patterns/
│   ├── nodejs/
│   └── authentication/
└── data/
    ├── sql-patterns/
    └── orm-patterns/
```

---

## Quick Routes

| Task | Path |
|------|------|
| **UI/Frontend** | `ui-navigation.md` |
| **Backend/API** | `backend-navigation.md` |
| **Clean code** | `principles/clean-code.md` |
| **API design** | `principles/api-design/overview.md` |

---

## By Concern

**Principles** → Universal development practices
**Frontend** → React, Vue, state management
**Backend** → APIs, Node.js, Python, auth
**Data** → SQL, NoSQL, ORMs
```

**Why**: Token-efficient (~280), shows specialized nav files, organized by concern

---

## Example 3: Specialized Navigation

**Pattern**: Cross-cutting (spans multiple categories)

```markdown
# UI Development Navigation

**Scope**: Frontend code + visual design

---

## Quick Routes

| Task | Path |
|------|------|
| **React patterns** | `frontend/react/hooks-patterns.md` |
| **TanStack Query** | `frontend/react/tanstack/query-patterns.md` |
| **Animations** | `../../ui/web/animation-patterns.md` |
| **Styling** | `../../ui/web/foundations/overview.md` |

---

## By Framework

**React** → `frontend/react/`
**Vue** → `frontend/vue/`

## By Concern

**Code patterns** → `development/frontend/`
**Visual design** → `ui/web/`
```

**Why**: Token-efficient (~270), spans categories, task-focused

---

## Anti-Patterns

- ❌ **Too verbose** (>500 tokens, paragraphs instead of tables)
- ❌ **Missing structure** (no ASCII tree, no quick routes)
- ❌ **Too detailed** (contains file contents instead of pointing to files)

## Key Takeaways

✅ **Token-efficient** (200-300 tokens), **Scannable** (ASCII trees, tables), **Task-focused** (quick routes), **Concise** (3-5 word descriptions)

**Related**: `core/context-system/guides/navigation-design.md`, `core/context-system/guides/organizing-context.md`