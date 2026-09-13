<!-- Context: core/standards/typescript/arrays | Priority: critical | Version: 1.0 | Updated: 2026-09-11 -->

# TypeScript Array Operations

## Functional Methods (Preferred)

**Rule: Prefer map/filter/reduce over for-loops**

```typescript
// ✅ GOOD - Functional chain with type inference
const files = messages
  .flatMap((x) => x.parts)
  .filter((x): x is Patch => x.type === "patch")
  .flatMap((x) => x.files)
  .map((x) => path.relative(worktree, x))

// ✅ GOOD - Parallel async operations
const results = await Promise.all(
  toolCalls.map(async (call) => {
    return executeCall(call)
  }),
)

// ✅ GOOD - Reduce for aggregation
const totalAdditions = diffs.reduce((sum, x) => sum + x.additions, 0)

// ✅ GOOD - Unique values
const uniqueNames = Array.from(new Set(items.map((x) => x.name)))

// ✅ GOOD - Sorting
const sorted = items.toSorted((a, b) => a.timestamp - b.timestamp)
```

## For-Loops (When Necessary)

**Rule: Use for-loops only for:**
1. Algorithm complexity (DP, graph traversal)
2. Early exit requirements
3. Sequential side effects
4. Performance-critical iteration

```typescript
// ✅ GOOD - Early exit
const patches = []
for (const msg of all) {
  if (msg.info.id === targetID) break
  for (const part of msg.parts) {
    if (part.type === "patch") {
      patches.push(part)
    }
  }
}

// ✅ GOOD - Sequential mutations
for (const key of Object.keys(tools)) {
  if (disabled.has(key)) {
    delete tools[key]
  }
}
```

## Type Guards on Filter

**Rule: Use type guards to maintain type inference downstream**

```typescript
// ✅ GOOD - Type guard preserves type information
const patches = messages
  .flatMap((msg) => msg.parts)
  .filter((part): part is PatchPart => part.type === "patch")
// patches is now PatchPart[], not Part[]

// ❌ BAD - Loses type information
const patches = messages
  .flatMap((msg) => msg.parts)
  .filter((part) => part.type === "patch")
// patches is still Part[], requires casting later
```

**Related**: `core/standards/typescript/overview.md`