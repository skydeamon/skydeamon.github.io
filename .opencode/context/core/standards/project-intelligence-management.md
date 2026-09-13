<!-- Context: core/standards/project-intelligence-management| Priority: high | Version: 1.0 | Updated: 2026-09-11 -->

# Project Intelligence Management

**Purpose**: How to manage project intelligence files and folders.

## Quick Reference

| Action | Do This |
|--------|---------|
| Update existing file | Edit + bump frontmatter version |
| Add new file | Create `.md` + add to navigation.md |
| Add subfolder | Create folder + `navigation.md` + update parent nav |
| Remove file | Rename `.deprecated.md` + archive, don't delete |

## Update Existing Files

**When**: Business changes → `business-domain.md`; new decision → `decisions-log.md`; new issues → `living-notes.md`; feature launch → `business-tech-bridge.md`; stack changes → `technical-domain.md`.

**Process**: Edit file → update frontmatter (`<!-- Context: {category} | Priority: {level} | Version: {X.Y} | Updated: {YYYY-MM-DD} -->`) → keep <200 lines → commit.

## Add New Files

**When**: New domain area needs dedicated docs; existing file exceeds 200 lines; specialized context requires separation.

**Naming**: Kebab-case, descriptive (`user-research.md`, `api-docs.md`).

**Template**:
```html
<!-- Context: project-intelligence/{filename} | Priority: {high|medium} | Version: 1.0 | Updated: {YYYY-MM-DD} -->

# File Title

> One-line purpose statement

## Quick Reference
- **Purpose**: [What this covers]
- **Update When**: [Triggers]
- **Related Files**: [Links]

## Content
[Follow patterns from existing files]

## Related Files
- [File 1] - [Description]
```

**Process**: Create file → add frontmatter → follow existing patterns → keep <200 lines → add to `navigation.md`.

## Create Subfolders

**When**: 5+ related files need grouping; subdomain warrants separation; improves navigation clarity.

**Structure**:
```
project-intelligence/
├── navigation.md           # Root nav
├── [new-subfolder]/
│   ├── navigation.md       # Subfolder nav required
│   ├── file-1.md
│   └── file-2.md
```

**Rule**: Every subfolder MUST have `navigation.md`. Avoid nesting deeper than 2 levels to prevent context fragmentation.

## Remove/Deprecate Files

**Process**: Rename `filename.md` → `filename.deprecated.md` → add frontmatter (`<!-- DEPRECATED: {date} - {Reason} -->`, `<!-- REPLACED BY: {new-file.md} -->`) → add banner (`> ⚠️ **DEPRECATED**: See `new-file.md``) → mark deprecated in `navigation.md`.

**Never Delete**: Decision history, lessons learned, context that might be needed later.

## Version Tracking

| Change | Version |
|--------|---------|
| New file | 1.0 |
| Content addition/update | MINOR |
| Structure change | MAJOR |
| Typo fix | PATCH |

**Date**: Always `YYYY-MM-DD`

## Quality Standards

- Files <200 lines; sections 3-7 per file
- Required: frontmatter, Quick Reference, Related files sections

**Anti-Patterns**: ❌ mix concerns ❌ exceed 200 lines ❌ delete files (archive instead) ❌ skip frontmatter ❌ duplicate info

## Governance

- **Ownership**: Business domain → Product Owner; Technical domain → Tech Lead; Decisions log → Tech Lead; Living notes → Team
- **Review cadence**: Quick review per PR; full review quarterly; archive review semi-annually

**Related**: `core/context-system.md`, `core/standards/project-intelligence.md`