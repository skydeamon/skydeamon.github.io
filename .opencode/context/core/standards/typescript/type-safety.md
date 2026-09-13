<!-- Context: core/standards/typescript/type-safety | Priority: critical | Version: 1.0 | Updated: 2026-09-11 -->

# TypeScript Type Safety

## TypeScript Types

**Rule: Use TypeScript's type system, avoid `any`**

```typescript
// ✅ GOOD - Explicit types
interface User {
  id: string
  name: string
  email: string
}

function getUser(id: string): User {
  // Implementation
}

// ❌ AVOID - any type
function getUser(id: any): any {
  // Loses all type safety
}
```

## Type Inference

**Rule: Let TypeScript infer when obvious**

```typescript
// ✅ GOOD - Inference works
const count = 42  // TypeScript knows this is number
const users = await fetchUsers()  // Type inferred from return type

// ❌ AVOID - Redundant annotations
const count: number = 42
const users: User[] = await fetchUsers()
```

## Type Guards

**Rule: Use type guards for runtime type checking**

```typescript
// ✅ GOOD - Type guard
function isUser(value: unknown): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "name" in value
  )
}

// Usage
if (isUser(data)) {
  console.log(data.name)  // TypeScript knows data is User
}
```

## Avoid Any

**Rule: Use `unknown` instead of `any` when type is truly unknown**

```typescript
// ✅ GOOD - unknown requires type checking
function processData(data: unknown) {
  if (typeof data === "string") {
    return data.toUpperCase()
  }
  throw new Error("Invalid data")
}

// ❌ AVOID - any bypasses type checking
function processData(data: any) {
  return data.toUpperCase()  // No compile-time safety
}
```

**Related**: `core/standards/typescript/overview.md`