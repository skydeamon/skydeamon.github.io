<!-- Context: core/workflows/feature-breakdown| Priority: high | Version: 2.0 | Updated: 2026-09-11 -->

# Task Breakdown Guidelines

**Purpose**: Framework for breaking down complex tasks into manageable, sequential subtasks.

## When to Use

- Task involves 4+ files
- Estimated effort >60 minutes
- Complex dependencies exist
- Multi-step coordination needed
- User requests task breakdown

## Breakdown Process

1. **Understand the Full Scope** — Complete requirement, all components, end goal, constraints
2. **Identify Major Phases** — Logical groupings, what must happen first, what can run in parallel
3. **Break Into Small Tasks** — 1-2 hours max each, clear/actionable, independently completable, easy to verify
4. **Define Dependencies** — What must be done first, what can be parallel, critical path
5. **Estimate Effort** — Realistic, include testing time, account for unknowns, add buffer

## Breakdown Template

```markdown
# Task Breakdown: {Task Name}

## Overview
{1-2 sentence description}

## Prerequisites
- [ ] {Prerequisite 1}

## Tasks

### Phase 1: {Phase Name}
**Goal:** {What this phase accomplishes}

- [ ] **Task 1.1:** {Description}
  - **Files:** {files to create/modify}
  - **Estimate:** {time estimate}
  - **Dependencies:** {none / task X}
  - **Verification:** {how to verify it's done}

## Testing Strategy
- [ ] Unit tests for {component}
- [ ] Integration tests for {flow}

## Total Estimate
**Time:** {X} hours
**Complexity:** {Low / Medium / High}

## Notes
{Any important context, decisions, or considerations}
```

## Best Practices

- **Keep tasks small** — 1-2 hours max; if larger, break down further
- **Make dependencies clear** — Explicitly state what must be done first; identify parallel work
- **Include verification** — How do you know the task is done? What should work?
- **Be realistic with estimates** — Include testing time, account for unknowns, add buffer
- **Group related work** — Organize by feature/component; keep phases logical and cohesive

## Common Patterns

- **Database-First**: Design schema → migrations → models → business logic → API endpoints → tests
- **Feature-First**: Define requirements → design interface → core logic → error handling → tests → docs
- **Refactoring**: Add tests for existing behavior → refactor small section → verify tests → repeat → cleanup → update docs

## Quick Reference

**Good breakdown**: small focused tasks (1-2h), clear dependencies, realistic estimates, verification criteria, logical phases.

**Checklist**: all requirements captured ✓ tasks small ✓ dependencies identified ✓ estimates realistic ✓ testing included ✓ verification clear ✓

**Related**: `core/workflows/task-delegation-basics.md`