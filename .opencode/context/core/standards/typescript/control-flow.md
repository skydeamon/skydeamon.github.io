<!-- Context: core/standards/typescript/control-flow | Priority: critical | Version: 1.0 | Updated: 2026-09-11 -->

# TypeScript Control Flow

## Early Returns

**Rule: Avoid `else` statements, use early returns**

```typescript
// ✅ GOOD - Early returns
function getStatus(session: Session) {
  if (!session) return "not_found"
  if (session.busy) return "busy"
  if (session.error) return "error"
  return "ready"
}

async function process(id: string) {
  const session = await getSession(id)
  if (!session) return { error: "Not found" }

  const result = await execute(session)
  if (!result.success) return { error: result.message }

  return { data: result.data }
}

// ❌ BAD - Else statements
function getStatus(session: Session) {
  if (!session) {
    return "not_found"
  } else {
    if (session.busy) {
      return "busy"
    } else {
      if (session.error) {
        return "error"
      } else {
        return "ready"
      }
    }
  }
}
```

## Guard Clauses

```typescript
// ✅ GOOD - Guard clauses at function start
async function updateSession(id: string, data: UpdateData) {
  if (!id) throw new Error("ID required")
  if (!data) throw new Error("Data required")
  if (data.title && data.title.length > 100) throw new Error("Title too long")

  // Main logic here
  const session = await getSession(id)
  await update(id, data)
  return session
}
```

## Switch Statements

**Rule: Use exhaustive switch with default case**

```typescript
// ✅ GOOD - Exhaustive switch
function handleEvent(event: Event) {
  switch (event.type) {
    case "start":
      return handleStart(event)
    
    case "update":
      return handleUpdate(event)
    
    case "complete":
      return handleComplete(event)
    
    default:
      const _exhaustive: never = event
      throw new Error(`Unhandled event type: ${(event as any).type}`)
  }
}
```

**Related**: `core/standards/typescript/overview.md`