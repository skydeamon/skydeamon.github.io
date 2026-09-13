<!-- Context: core/standards/typescript/async | Priority: critical | Version: 1.0 | Updated: 2026-09-11 -->

# TypeScript Async Patterns

## Parallel Execution (Default Pattern)

**Rule: Use `Promise.all` for independent operations**

```typescript
// ✅ GOOD - Parallel independent operations
const [language, cfg, provider, auth] = await Promise.all([
  getLanguage(model),
  getConfig(),
  getProvider(model.providerID),
  getAuth(model.providerID),
])

// ✅ GOOD - Parallel array processing
const results = await Promise.all(
  items.map(async (item) => {
    return processItem(item)
  }),
)

// ❌ BAD - Sequential when independent
const language = await getLanguage(model)
const cfg = await getConfig()  // Could run in parallel!
const provider = await getProvider(model.providerID)
```

## Sequential Operations

**Rule: Chain when operations depend on previous results**

```typescript
// ✅ GOOD - Sequential dependency chain
const session = await createSession({ title: "New" })
const message = await addMessage(session.id, { content: "Hello" })
const response = await processMessage(message.id)

// ✅ GOOD - Promise chain for clarity
const result = await createSession({ title: "New" })
  .then((session) => addMessage(session.id, { content: "Hello" }))
  .then((message) => processMessage(message.id))
```

## Error Handling in Async

**Rule: Prefer `.catch()` over try/catch when possible**

```typescript
// ✅ GOOD - Catch at call site
const result = await operation().catch((error) => {
  console.error("Operation failed", error)
  return defaultValue
})

// ✅ GOOD - Promise.all with error handling
const results = await Promise.all(
  items.map(async (item) => {
    return processItem(item).catch((error) => {
      console.error("Item failed", { item, error })
      return null
    })
  }),
)

// ✅ ACCEPTABLE - try/catch for multiple operations
try {
  const session = await createSession(input)
  await addMessage(session.id, message)
  await publishEvent({ session })
  return session
} catch (error) {
  console.error("Session creation failed", error)
  throw error
}

// ❌ AVOID - try/catch for single operation
try {
  const result = await operation()
  return result
} catch (error) {
  console.error(error)
  throw error
}
// Better:
const result = await operation().catch((error) => {
  console.error(error)
  throw error
})
```

**Related**: `core/standards/typescript/overview.md`