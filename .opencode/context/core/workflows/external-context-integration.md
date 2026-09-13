<!-- Context: core/workflows/external-context-integration| Priority: high | Version: 1.0 | Updated: 2026-09-11 -->
# External Context Integration Guide

## Overview

How to integrate external context (fetched via ExternalScout) into the agent workflow so subagents can access it without re-fetching.

**Key Principle**: Main agents fetch external docs once → persist to disk → reference in session → subagents read (no re-fetching)

---

## When to Use

**Use ExternalScout when**: User asks about external libraries, task involves integration between multiple libraries, setup/configuration of external tools needed, API patterns from external libraries relevant.

**Don't use when**: Question is about internal code, answer is in `.opencode/context/` (use ContextScout), user asks for general programming concepts.

---

## Integration Workflow

### Stage 1: Analyze & Discover (Before Approval)
1. Analyze user request → identify external libraries
2. Call ContextScout for internal context
3. Call ExternalScout for external docs → persists to `.tmp/external-context/`
4. Capture returned file paths (don't write to disk yet)

### Stage 2: Propose Plan (Before Approval)
Show user: what will be done, which external libraries involved, which context files will be used. Wait for approval.

### Stage 3: Init Session (After Approval)
Create `.tmp/sessions/{session-id}/context.md` with sections:
- `## Context Files` (from ContextScout)
- `## Reference Files` (project files)
- `## External Context Fetched` (from ExternalScout) — **CRITICAL section**

### Stage 4: Delegate with Context Path
Pass session path to TaskManager: "Load context from `.tmp/sessions/{session-id}/context.md`"

### Stage 5: Subagents Read External Context
TaskManager/CoderAgent reads session → extracts "## External Context Fetched" → reads referenced files → **NO RE-FETCHING**

---

## Best Practices

### For Main Agents
✅ Call ExternalScout early in planning phase
✅ Capture returned file paths
✅ Add to session context under "## External Context Fetched"
✅ Pass session path to subagents

❌ Forget to call ExternalScout when external libraries involved
❌ Skip adding external context to session
❌ Re-fetch external docs (trust ExternalScout persistence)

### For Subagents
✅ Read external_context files from subtask JSON
✅ Use external docs to inform implementation
✅ Reference external docs in comments

❌ Re-fetch external documentation
❌ Modify external context files (read-only)

---

## Troubleshooting

- **External context files not found**: Check ExternalScout ran, verify paths, check `.manifest.json`
- **Stale external context**: Delete stale files, re-run ExternalScout
- **Manifest out of sync**: Regenerate with `manage-external-context.sh regenerate-manifest`

**Related**: `core/workflows/external-context-management.md`, `core/workflows/task-delegation-basics.md`