<!-- Context: core/workflows/external-context-management| Priority: high | Version: 1.0 | Updated: 2026-09-11 -->
# External Context Management

## Overview

External context is live documentation fetched from external libraries (via Context7 API or official docs). Persisted to `.tmp/external-context/` so main agents can pass it to subagents without re-fetching.

**Key Principle**: ExternalScout fetches once → persists to disk → main agents reference → subagents read (no re-fetching)

---

## Directory Structure

```
.tmp/external-context/
├── .manifest.json                    # Metadata about all cached docs
├── {package-name}/
│   ├── {topic}.md                   # Fetched documentation
│   └── {topic}.md
```

### Naming Conventions
- **Directory**: Exact npm package name (kebab-case): `drizzle-orm`, `better-auth`, `next.js`
- **File**: Kebab-case topic: `modular-schemas.md`, `nextjs-integration.md`

---

## Manifest File

**Location**: `.tmp/external-context/.manifest.json`

Tracks what's cached, when fetched, from which source. Structure:
```json
{
  "last_updated": "2026-01-28T14:30:22Z",
  "packages": {
    "drizzle-orm": {
      "files": ["modular-schemas.md", "postgresql-setup.md"],
      "last_updated": "2026-01-28T14:30:22Z",
      "source": "Context7 API",
      "official_docs": "https://orm.drizzle.team"
    }
  }
}
```

---

## File Format

Each file has metadata header:
```markdown
---
source: Context7 API
library: Drizzle ORM
package: drizzle-orm
topic: modular-schemas
fetched: 2026-01-28T14:30:22Z
official_docs: https://orm.drizzle.team/docs/goodies#multi-file-schemas
---
# Content...
```

---

## Workflow

1. **Main Agent** detects external libraries → calls ExternalScout
2. **ExternalScout** fetches from Context7 API → filters → persists to `.tmp/external-context/` → updates manifest
3. **Main Agent** creates session with "## External Context Fetched" section listing files
4. **Subagents** read session → read external context files → **NO RE-FETCHING**

---

## Cleanup

When to clean: task complete, docs stale (>7 days), user requests, disk space needed.

Manual: `rm -rf .tmp/external-context/{package-name}/` + update manifest.

---

## Best Practices

### Main Agents
1. Call ExternalScout early in planning phase
2. Capture returned file paths
3. Add to session context in "## External Context Fetched" section
4. Pass session path to subagents

### ExternalScout
1. Always persist to `.tmp/external-context/`
2. Update `.manifest.json` after each fetch
3. Include metadata header in every file
4. Filter aggressively — only relevant sections
5. Cite sources with official docs links

### Subagents
1. Read external context files from session context
2. Don't re-fetch — use persisted files
3. Reference in implementation comments
4. Don't modify external context files (read-only)

---

## Troubleshooting

- **Files not found**: Check ExternalScout ran, verify paths, check `.manifest.json`
- **Stale docs**: Delete stale files, re-run ExternalScout, update session context
- **Manifest out of sync**: Regenerate by listing actual files, update manifest to match

**Related**: `core/workflows/external-context-integration.md`, `core/workflows/task-delegation-basics.md`