<!-- Context: core/context-system/standards/templates| Priority: high | Version: 1.0 | Updated: 2026-09-11 -->
# Context File Templates

**Purpose**: Standard formats for all context file types

## Template Selection

| Type | Max Lines | Required Sections |
|------|-----------|-------------------|
| Concept | 100 | Purpose, Core Idea (1-3 sentences), Key Points (3-5), Example (<10 lines), Reference, Related |
| Example | 80 | Purpose, Use Case, Code (10-30 lines), Explanation, Related |
| Guide | 150 | Purpose, Prerequisites, Steps (4-7), Verification, Related |
| Lookup | 100 | Purpose, Tables/Lists, Commands, Related |
| Error | 150 | Purpose, Per-error: Symptom, Cause, Solution, Prevention, Reference, Related |
| Navigation | 100 | Purpose, Structure, Quick Routes, By Concern, Related Context |

**All templates must have**: Title with type prefix (`# Concept:`, etc.), `**Purpose**` (1 sentence), `**Last Updated**` (YYYY-MM-DD), `**Related**` section.

## 1. Concept Template
```markdown
<!-- Context: {category}/concepts/{name}| Priority: {level} | Version: 1.0 | Updated: YYYY-MM-DD -->
# Concept: {Name}
**Purpose**: [1 sentence]
**Last Updated**: {YYYY-MM-DD}
## Core Idea
[1-3 sentences]
## Key Points
- Point 1
- Point 2
- Point 3
## When to Use
- Use case 1
- Use case 2
## Quick Example
```lang
[<10 lines]
```
## Deep Dive
**Reference**: [Link or "See implementation above"]
## Related
- concepts/x.md
```

## 2. Example Template
```markdown
<!-- Context: {category}/examples/{name}| Priority: {level} | Version: 1.0 | Updated: YYYY-MM-DD -->
# Example: {What It Shows}
**Purpose**: [1 sentence]
**Last Updated**: {YYYY-MM-DD}
## Use Case
[2-3 sentences]
## Code
```lang
[10-30 lines]
```
## Explanation
1. Step 1
2. Step 2
## Related
- concepts/x.md
```

## 3. Guide Template
```markdown
<!-- Context: {category}/guides/{name}| Priority: {level} | Version: 1.0 | Updated: YYYY-MM-DD -->
# Guide: {Action}
**Purpose**: [1 sentence]
**Last Updated**: {YYYY-MM-DD}
## Prerequisites
- Requirement 1
**Estimated time**: X min
## Steps
### 1. {Step}
```bash
{command}
```
**Expected**: [result]
### 2. {Step}
[Repeat 4-7 steps]
## Verification
```bash
{verify command}
```
## Troubleshooting
| Issue | Solution |
|-------|----------|
| Problem | Fix |
## Related
- concepts/x.md
```

## 4. Lookup Template
```markdown
<!-- Context: {category}/lookup/{name}| Priority: {level} | Version: 1.0 | Updated: YYYY-MM-DD -->
# Lookup: {Reference Type}
**Purpose**: Quick reference for {desc}
**Last Updated**: {YYYY-MM-DD}
## {Section}
| Item | Value | Desc |
|------|-------|------|
| x | y | z |
## Commands
```bash
# Description
{command}
```
## Related
- concepts/x.md
```

## 5. Error Template
```markdown
<!-- Context: {category}/errors/{name}| Priority: {level} | Version: 1.0 | Updated: YYYY-MM-DD -->
# Errors: {Framework}
**Purpose**: Common errors for {framework}
**Last Updated**: {YYYY-MM-DD}
## Error: {Name}
**Symptom**:
```
{error message}
```
**Cause**: [1-2 sentences]
**Solution**:
1. Step 1
2. Step 2
**Code**:
```lang
// ❌ Before
{bad}
// ✅ After
{fixed}
```
**Prevention**: [how to avoid]
**Frequency**: common/occasional/rare
---
[Repeat for 5-10 errors]
## Related
- concepts/x.md
```

## 6. Navigation Template

Use `navigation.md` instead of `README.md` for better discoverability. Target 200-300 tokens.

```markdown
# {Category} Navigation
**Purpose**: [1 sentence]
## Structure
```
{category}/
├── navigation.md
├── {subcategory}/
│   ├── navigation.md
│   └── {files}.md
```
## Quick Routes
| Task | Path |
|------|------|
| **{Task 1}** | `{path}` |
## By {Concern/Type}
**{Section 1}** → {description}
## Related Context
- **{Category}** → `../{category}/navigation.md`
```

**Related**: `core/context-system/guides/workflows.md`