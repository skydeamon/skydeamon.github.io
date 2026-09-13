<!-- Context: core/context-system/operations/harvest| Priority: medium | Version: 1.0 | Updated: 2026-09-11 -->

# Context Harvest Operation

**Purpose**: Extract knowledge from AI summaries → permanent context, then clean workspace

---

## Core Problem

AI agents create summary files (OVERVIEW.md, SESSION-*.md, SUMMARY.md) that contain valuable knowledge but clutter the workspace. **Solution**: Harvest the knowledge → permanent context, then delete the summaries.

## Auto-Detection Patterns

- Filename: `*OVERVIEW.md`, `*SUMMARY.md`, `SESSION-*.md`, `CONTEXT-*.md`, `*NOTES.md`
- Location: `.tmp/` directory, files >2KB in root

---

## 6-Stage Workflow

### Stage 1: Scan
Find all summary files matching auto-detection patterns. List with sizes, sort newest first.

### Stage 2: Analyze
Categorize content by function:

| Content Type | Target Folder | How to Identify |
|--------------|---------------|-----------------|
| Design decisions | `concepts/` | "We decided to...", "Architecture" |
| Solutions/patterns | `examples/` | Code snippets, "Here's how we..." |
| Workflows | `guides/` | Numbered steps, "How to..." |
| Errors encountered | `errors/` | Error messages, "Fixed issue" |
| Reference data | `lookup/` | Tables, lists, paths, commands |

### Stage 3: Approve (CRITICAL)
Present approval UI with letter-based selection (A/B/C or 'all'). **NEVER auto-harvest without user confirmation.**

### Stage 4: Extract
Apply MVI to each approved item: core concept (1-3 sentences), key points (3-5 bullets), minimal example (<10 lines). Show extraction preview for approval.

### Stage 5: Cleanup (APPROVAL REQUIRED)
Options: 1. Archive (move to `.tmp/archive/harvested/{date}/`), 2. Delete (permanent), 3. Keep (no cleanup). Only cleanup files with successfully harvested content.

### Stage 6: Report
Show: items harvested, files created/updated, navigation maps updated, disk space freed.

---

## Smart Content Detection

✅ **Extract**: Design decisions, patterns that worked, errors + solutions, API changes, performance findings, core concepts

❌ **Skip**: Planning discussion, conversational notes, duplicate info, TODO lists, timestamps/session metadata

---

## Safety Features

1. **Approval gate** — Never auto-delete without confirmation
2. **Archive by default** — Move to `.tmp/archive/`, not permanent delete
3. **Validation** — Check file sizes, structure before committing
4. **Rollback** — Can restore from archive if needed

**Related**: `core/context-system.md`, `core/context-system/operations/extract.md`