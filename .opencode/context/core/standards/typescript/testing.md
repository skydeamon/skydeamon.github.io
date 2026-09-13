<!-- Context: core/standards/typescript/testing | Priority: critical | Version: 1.0 | Updated: 2026-09-11 -->

# TypeScript Testing Principles

## Test Structure

**Rule: Follow Arrange-Act-Assert pattern**

```typescript
// ✅ GOOD - AAA pattern
test("creates user with valid data", async () => {
  // Arrange
  const userData = { name: "Alice", email: "alice@example.com" }
  
  // Act
  const user = await createUser(userData)
  
  // Assert
  expect(user.name).toBe("Alice")
  expect(user.email).toBe("alice@example.com")
})
```

## Coverage Goals

**Rule: Test both success and failure cases**

```typescript
// ✅ GOOD - Both positive and negative tests
describe("createUser", () => {
  test("creates user with valid data", async () => {
    const user = await createUser({ name: "Alice", email: "alice@example.com" })
    expect(user).toBeDefined()
  })
  
  test("throws error with invalid email", async () => {
    await expect(
      createUser({ name: "Alice", email: "invalid" })
    ).rejects.toThrow("Invalid email")
  })
})
```

## Mock External Dependencies

**Rule: Mock all external dependencies**

```typescript
// ✅ GOOD - Mocked dependencies
test("fetches user data", async () => {
  const mockFetch = vi.fn().mockResolvedValue({
    json: () => Promise.resolve({ id: "1", name: "Alice" })
  })
  
  global.fetch = mockFetch
  
  const user = await fetchUser("1")
  expect(user.name).toBe("Alice")
})
```

**Related**: `core/standards/typescript/overview.md`, `core/standards/test-coverage.md`