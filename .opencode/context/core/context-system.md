<!-- Context: core/context-system | Priority: critical | Version: 1.0 | Updated: 2026-09-11 -->

# Context System

**Purpose**: Minimal, concern-based knowledge organization for AI agents

---

## Core Principles

### 1. Minimal Viable Information (MVI)
Extract only core concepts (1-3 sentences), key points (3-5 bullets), minimal example, and reference link. **Goal**: Scannable in <30 seconds.

### 2. Concern-Based Structure
Organize by **what you're doing** (concern), then by **how** (approach/tech):

**Pattern A: Function-Based** (repository-specific):
```
category/
├── navigation.md
├── concepts/    # What it is
├── examples/    # Working code
├── guides/      # How to do it
├── lookup/      # Quick reference
└── errors/      # Common issues
```

**Pattern B: Concern-Based** (development context):
```
category/
├── navigation.md
├── {concern}/
│   ├── navigation.md
│   ├── {approach}/
│   └── {tech}/
```

### 3. Token-Efficient Navigation
Every category has `navigation.md` with ASCII tree (~50 tokens), quick routes table (~100 tokens), by concern/type (~50 tokens). **Target**: 200-300 tokens.

### 4. Self-Describing Filenames
- ❌ `code.md` → ✅ `code-quality.md`
- ❌ `tests.md` → ✅ `test-coverage.md`

---

## Organizing Principles

### Core Standards vs Development Principles

| Location | Scope | Examples |
|----------|-------|----------|
| `core/standards/` | **Universal** (all projects) | Code quality, testing, docs, security |
| `development/principles/` | **Development-specific** | Clean code, API design, error handling |

### Technology Context
- **Full-Stack Frameworks** → `development/frameworks/{tech}/`
- **Specialized Concerns** → `development/{concern}/{tech}/`
- **Layer-Specific** → `development/{frontend|backend}/{tech}/`

---

## Operations

| Command | Purpose |
|---------|---------|
| `/context harvest` | Extract from summaries → permanent context, clean up |
| `/context extract {source}` | From docs/code/URLs |
| `/context organize {category}` | Restructure flat files → function folders |
| `/context update {what}` | When APIs/frameworks change |
| `/context error {error}` | Add recurring error to knowledge base |
| `/context compact {file}` | Minimize verbose file to MVI format |
| `/context map [category]` | View context structure |
| `/context validate` | Check integrity, references, sizes |

All operations show preview before asking for approval.

---

## File Naming Conventions

- `navigation.md` — Main navigation for category/subcategory
- `{domain}-navigation.md` — Specialized cross-cutting navigation
- Use descriptive names: `code-quality.md` not `code.md`
- Use kebab-case: `scroll-linked-animations.md`

---

## Extraction Rules

✅ Extract: Core concepts, essential patterns, step-by-step workflows, critical errors, quick reference data, links to detailed docs

❌ Don't Extract: Verbose explanations, complete API docs, implementation details, historical context, marketing content, duplicate info

---

## Success Criteria

✅ **Minimal** (<200 lines/file) · ✅ **Navigable** (navigation.md at every level) · ✅ **Token-efficient** (~200-300 tokens/nav) · ✅ **Self-describing** filenames · ✅ **Maintainable**

**Related**: `core/context-system/guides/workflows.md`, `core/context-system/examples/navigation-examples.md`, `core/context-system/standards/templates.md`