<!-- Context: core/context-system/guides/workflows| Priority: high | Version: 1.0 | Updated: 2026-09-11 -->

# Context Operation Workflows

**Purpose**: Interactive workflows for all context operations

---

## Extract Workflow

1. **Read Source** — Analyze content for extractable items
2. **Analyze** — Categorize: concepts, errors, workflows, references
3. **Select Category** (APPROVAL) — Choose target category + items to extract
4. **Preview** (APPROVAL) — Show files to create, line counts, preview specific file
5. **Create** — Write files, update navigation, report results

---

## Organize Workflow

1. **Scan** — Analyze category structure and files
2. **Categorize** — Determine function-based or concern-based pattern
3. **Resolve Conflicts** (APPROVAL) — Present ambiguous files, conflicts, resolution options (A/B/C)
4. **Preview** (APPROVAL) — Show moves, splits, merges, reference fixes; dry-run option
5. **Backup** → **Execute** → **Update navigation** → **Report**

---

## Update Workflow

1. **Identify Changes** (APPROVAL) — What changed (API changes, deprecations, breaking changes)
2. **Find Affected Files** — Search for references, count impact
3. **Preview** (APPROVAL) — Line-by-line diffs for each file; edit mode available
4. **Backup** → **Update files** → **Add migration notes** → **Validate references** → **Report**

---

## Error Workflow

1. **Search Existing** — Find similar/related errors in knowledge base
2. **Check Duplication** (APPROVAL) — Options: add new, update existing, or skip
3. **Preview** (APPROVAL) — Show current vs proposed content
4. **Update** → **Cross-reference** → **Report**

---

## Common Patterns

### Approval Gates
All operations with `enforce="@critical_rules.approval_gate"` MUST:
1. Show clear preview of what will happen
2. Wait for explicit user input
3. Provide options (yes/no/edit/preview/dry-run)
4. Never proceed without confirmation

### Conflict Resolution
When conflicts detected: present all options clearly, use letter-based selection (A/B/C), show impact, allow user to choose.

### Backups
Operations that modify files MUST create backup in `.tmp/backup/{operation}-{topic}-{timestamp}/` and report location.

**Related**: `core/context-system.md`, `core/context-system/operations/harvest.md`