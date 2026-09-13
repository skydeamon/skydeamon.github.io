<!-- Context: core/standards/typescript/variables | Priority: critical | Version: 1.0 | Updated: 2026-09-11 -->

# TypeScript Variable Naming

## Variable Declaration

**Rule: Prefer `const` over `let`**

```typescript
// ✅ GOOD - Immutable with ternary
const foo = condition ? 1 : 2
const result = await (isValid ? processValid() : processInvalid())

// ❌ BAD - Reassignment
let foo
if (condition) {
  foo = 1
} else {
  foo = 2
}

// ✅ GOOD - Early return instead of reassignment
function getValue(condition: boolean) {
  if (condition) return 1
  return 2
}

// ✅ ACCEPTABLE - let when mutation is necessary
let accumulator = 0
for (const item of items) {
  accumulator += item.value
}
```

## Destructuring

**Rule: Avoid unnecessary destructuring, preserve context with dot notation**

```typescript
// ✅ GOOD - Preserve context
function process(session: Session) {
  console.log("processing", { id: session.id, title: session.title })
  return {
    id: session.id,
    status: session.status,
    owner: session.owner
  }
}

// ❌ BAD - Loses context, harder to read
function process(session: Session) {
  const { id, title, status, owner } = session
  console.log("processing", { id, title })
  return { id, status, owner }
}

// ✅ ACCEPTABLE - Destructuring when improving readability
function renderUser({ name, email, avatar }: User) {
  return `<div>${name} (${email})</div>`
}

// ✅ ACCEPTABLE - Destructuring array returns
const [language, cfg, provider] = await Promise.all([...])
```

**Related**: `core/standards/typescript/overview.md`