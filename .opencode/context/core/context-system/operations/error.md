<!-- Context: core/context-system/operations/error| Priority: medium | Version: 1.0 | Updated: 2026-09-11 -->

# Error Operation

**Purpose**: Add recurring errors to knowledge base with deduplication

---

## When to Use

- Encountered same error multiple times
- Want to document solution for team
- Building error knowledge base

---

## 6-Stage Workflow

### Stage 1: Search Existing
Search error message across all `errors/` files. Find similar (fuzzy match) and related (same category) errors.

### Stage 2: Check Duplication (APPROVAL REQUIRED)
Options:
- **[A]** Add as new error (specific case)
- **[B]** Update existing error (add new example)
- **[C]** Skip (already covered)

Select option + category (e.g., 'B 1')

### Stage 3: Preview (APPROVAL REQUIRED)
Show current vs proposed content with line-by-line diffs. Allow edit mode.

### Stage 4: Add/Update
Add or update error entry following template format. Maintain file size <150 lines.

**Error Template**:
```markdown
## Error: {Name}
**Symptom**: [Error message]
**Cause**: [Why - 1-2 sentences]
**Solution**: [Steps]
**Code**: [Before/After example]
**Prevention**: [How to avoid]
**Frequency**: common/occasional/rare
```

### Stage 5: Update Navigation
Update README.md if new file created. Add cross-references to related errors.

### Stage 6: Report
Show: file updated, cross-references added, file size status.

---

## Deduplication Strategy

| Situation | Action |
|-----------|--------|
| Same root cause, different manifestations | **Update existing** with new examples |
| Different causes, same category | **Cross-reference** between errors |
| Exact same error already documented | **Skip** |
| Unique error not yet documented | **Add as new** entry |

**Grouping**: One file per framework/topic (e.g., `react-errors.md`), NOT one file per error.

**Related**: `core/context-system/standards/templates.md`, `core/context-system/guides/workflows.md`