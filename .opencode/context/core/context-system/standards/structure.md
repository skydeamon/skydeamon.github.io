<!-- Context: core/context-system/standards/structure| Priority: critical | Version: 1.0 | Updated: 2026-09-11 -->
# Context Structure

**Purpose**: Function-based folder organization for easy discovery

## Core Structure

<rule id="function_structure" enforcement="strict">
  ALWAYS organize by function (what info does), not just by topic.
  
  Required folders:
  - concepts/  - Core ideas, definitions, "what is it?"
  - examples/  - Minimal working code
  - guides/    - Step-by-step workflows
  - lookup/    - Quick reference tables, commands, paths
  - errors/    - Common issues, gotchas, fixes
</rule>

```
.opencode/context/{category}/
├── navigation.md              # Navigation map (REQUIRED)
├── concepts/              # What it is
│   └── {topic}.md
├── examples/              # Working code
│   └── {example}.md
├── guides/                # How to do it
│   └── {guide}.md
├── lookup/                # Quick reference
│   └── {reference}.md
└── errors/                # Common issues
    └── {framework}.md
```

## Folder Purposes

| Folder | Purpose | Contains | Rule |
|--------|---------|----------|------|
| `concepts/` | Core ideas, definitions | Fundamental concepts, design patterns, architecture decisions | — |
| `examples/` | Minimal working code | Code snippets that work as-is, minimal reproductions | <30 lines of code, fully functional |
| `guides/` | Step-by-step workflows | Numbered procedures, setup instructions, migration guides | Steps actionable (not theoretical) |
| `lookup/` | Quick reference | Command lists, file locations, API endpoints, config options | Table/list format (scannable) |
| `errors/` | Common errors, gotchas | Error messages + fixes, pitfalls, edge cases | Group by framework/topic, not one file per error |

## navigation.md Requirement

<rule id="readme_required" enforcement="strict">
  Every context category MUST have navigation.md at its root with:
  1. Purpose (1-2 sentences)
  2. Navigation tables for each function folder
  3. Priority levels (critical/high/medium/low)
  4. Loading strategy (what to load for common tasks)
</rule>

**Example**:
```markdown
# Development Context
**Purpose**: Core development patterns, errors, and examples

## Quick Navigation
### Concepts
| File | Description | Priority |
|------|-------------|----------|
| concepts/auth.md | Authentication patterns | critical |
### Examples
| File | Description | Priority |
|------|-------------|----------|
| examples/jwt.md | JWT auth example | high |
### Errors
| File | Description | Priority |
|------|-------------|----------|
| errors/react.md | Common React errors | high |

## Loading Strategy
**For auth work**: 
1. Load concepts/auth.md
2. Load examples/jwt.md
3. Reference guides/setup-auth.md if needed
```

## Categorization Rules

| Question | Folder |
|----------|--------|
| Does it explain **what** something is? | `concepts/` |
| Does it show **working code**? | `examples/` |
| Does it explain **how to do** something? | `guides/` |
| Is it **quick reference** data? | `lookup/` |
| Does it document an **error/issue**? | `errors/` |

## Anti-Patterns ❌

### ❌ Flat Structure
```
development/
├── authentication.md
├── jwt-example.md
├── setting-up-auth.md
├── auth-errors.md
└── api-endpoints.md
```
**Problem**: Hard to discover. Is authentication.md a concept or guide?

### ✅ Function-Based
```
development/
├── navigation.md
├── concepts/    └── authentication.md
├── examples/    └── jwt-example.md
├── guides/      └── setting-up-auth.md
├── lookup/      └── api-endpoints.md
└── errors/      └── auth-errors.md
```
**Benefit**: Instantly know file purpose by location

## Validation

- [ ] All categories have navigation.md?
- [ ] Files are in function folders (not flat)?
- [ ] README has navigation tables?
- [ ] Priority levels assigned?
- [ ] Loading strategy documented?

**Related**: `core/context-system/standards/templates.md`