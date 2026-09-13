<!-- Context: core/standards/typescript/organization | Priority: critical | Version: 1.0 | Updated: 2026-09-11 -->

# TypeScript Code Organization

## Import Order

**Rule: Organize imports by source**

```typescript
// ✅ GOOD - Organized imports
// 1. Node built-ins
import path from "path"
import fs from "fs/promises"

// 2. External packages
import { z } from "zod"
import express from "express"

// 3. Internal modules
import { User } from "./types"
import { getConfig } from "./config"
```

## Naming Conventions

```typescript
// ✅ GOOD - Clear naming
const session = await getSession(id)
const user = await getCurrentUser()
const messages = await getMessages({ sessionID })

// ❌ BAD - Unnecessary verbosity
const currentSession = await getSession(id)
const currentlyAuthenticatedUser = await getCurrentUser()
const sessionMessagesList = await getMessages({ sessionID })

// ✅ GOOD - Multi-word when single word is ambiguous
const sessionID = params.id
const userAgent = req.headers["user-agent"]
const maxRetries = config.retries
```

## File Structure

**Rule: One primary export per file**

```typescript
// user.ts
export interface User {
  id: string
  name: string
}

export async function getUser(id: string): Promise<User> {
  // Implementation
}

export async function createUser(data: CreateUserInput): Promise<User> {
  // Implementation
}
```

**Related**: `core/standards/typescript/overview.md`