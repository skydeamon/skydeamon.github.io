<!-- Context: core/standards/csharp/types-and-nullability | Priority: critical | Version: 1.1 | Updated: 2026-09-11 -->

# C# Type Safety & Nullability

## Enable Nullable Reference Types

**Rule: Always enable nullable reference types in all projects**

```xml
<!-- .csproj -->
<PropertyGroup>
  <Nullable>enable</Nullable>
  <WarningsAsErrors>nullable</WarningsAsErrors>
</PropertyGroup>
```

```csharp
// ✅ GOOD - Explicit nullability
public string Name { get; set; }          // Non-nullable: must be assigned
public string? MiddleName { get; set; }   // Nullable: may be null

public User? FindUser(Guid id) { }        // Returns null if not found
public User GetUser(Guid id) { }          // Never returns null (throws if not found)
```

## Null Handling

```csharp
// ✅ GOOD - Null-coalescing and conditional operators
var name = user?.Name ?? "Unknown";
var city = user?.Address?.City ?? string.Empty;
user?.Notify("Welcome");

// ✅ GOOD - Null guard at method entry
public void ProcessOrder(Order order)
{
    ArgumentNullException.ThrowIfNull(order);
    // ...
}

// ✅ GOOD - Null-coalescing assignment
_cache ??= new Dictionary<string, User>();

// ❌ AVOID - Manual null checks where operators suffice
if (user != null && user.Address != null)
    city = user.Address.City;
```

## Avoid Primitive Obsession

```csharp
// ✅ GOOD - Strongly typed IDs prevent mixing up parameters
public readonly record struct UserId(Guid Value);
public readonly record struct OrderId(Guid Value);

public Task<Order> GetOrderAsync(OrderId orderId, UserId userId) { }

// ❌ AVOID - Raw Guids are easy to mix up
public Task<Order> GetOrderAsync(Guid orderId, Guid userId) { }
```

**Related**: `core/standards/csharp/overview.md`