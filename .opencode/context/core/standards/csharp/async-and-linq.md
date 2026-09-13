<!-- Context: core/standards/csharp/async-and-linq | Priority: critical | Version: 1.1 | Updated: 2026-09-11 -->

# C# Async/Await & LINQ Patterns

## Async/Await

### Always Use CancellationToken

**Rule: Every public async method must accept a CancellationToken**

```csharp
// ✅ GOOD - CancellationToken flows through all async calls
public async Task<User> GetUserAsync(Guid userId, CancellationToken cancellationToken = default)
{
    var user = await _repository.FindAsync(userId, cancellationToken);
    return user ?? throw new NotFoundException($"User {userId} not found");
}

// ❌ AVOID - No way to cancel long-running operations
public async Task<User> GetUserAsync(Guid userId)
{
    return await _repository.FindAsync(userId);
}
```

## LINQ

### Prefer Method Syntax for Simple Chains

```csharp
// ✅ GOOD - Method syntax for filter/project/sort
var activeUserNames = users
    .Where(u => u.IsActive)
    .OrderBy(u => u.LastName)
    .Select(u => u.FullName)
    .ToList();

// ✅ GOOD - Query syntax for complex joins (more readable)
var result =
    from order in orders
    join user in users on order.UserId equals user.Id
    where order.Status == OrderStatus.Pending
    select new { order.Id, user.Name };
```

### Materialize at the Right Time

```csharp
// ✅ GOOD - Materialize once, use the list
var activeUsers = users.Where(u => u.IsActive).ToList();
var count = activeUsers.Count;
var first = activeUsers.FirstOrDefault();

// ❌ AVOID - Multiple enumerations of IEnumerable (re-evaluates query each time)
var activeUsers = users.Where(u => u.IsActive);
var count = activeUsers.Count();   // evaluates query
var first = activeUsers.First();   // evaluates query again
```

### Use Appropriate Termination Methods

```csharp
// ✅ GOOD - Choose the right method for the intent
var first = items.FirstOrDefault();           // null if empty
var single = items.SingleOrDefault();         // null if empty, throws if >1
var any = items.Any(x => x.IsActive);         // bool, stops at first match
var all = items.All(x => x.IsActive);         // bool, fails fast on false
var count = items.Count(x => x.IsActive);     // full enumeration

// ❌ AVOID - Using Count() to check existence (full enumeration)
if (items.Count() > 0) { }   // Use Any() instead
```

### Avoid LINQ in Performance-Critical Paths

```csharp
// ✅ GOOD - Direct loop when allocation matters
var total = 0m;
foreach (var item in orderItems)
    total += item.Price * item.Quantity;

// LINQ alternative (fine for most code, avoids premature optimization)
var total = orderItems.Sum(item => item.Price * item.Quantity);
```

**Related**: `core/standards/csharp/overview.md`