<!-- Context: core/standards/csharp/pattern-matching | Priority: critical | Version: 1.1 | Updated: 2026-09-11 -->

# C# Pattern Matching

## Switch Expressions (Prefer over switch statements)

```csharp
// ✅ GOOD - Switch expression: concise, exhaustive
public decimal GetDiscount(CustomerTier tier) => tier switch
{
    CustomerTier.Bronze => 0.00m,
    CustomerTier.Silver => 0.05m,
    CustomerTier.Gold   => 0.10m,
    CustomerTier.Platinum => 0.20m,
    _ => throw new ArgumentOutOfRangeException(nameof(tier), tier, null)
};

// ❌ AVOID - Verbose switch statement for simple value mapping
switch (tier)
{
    case CustomerTier.Bronze: return 0.00m;
    case CustomerTier.Silver: return 0.05m;
    // ...
}
```

## Type Patterns

```csharp
// ✅ GOOD - Type pattern with declaration
public string Describe(Shape shape) => shape switch
{
    Circle c    => $"Circle with radius {c.Radius}",
    Rectangle r => $"Rectangle {r.Width}x{r.Height}",
    Triangle t  => $"Triangle with base {t.Base}",
    _           => "Unknown shape"
};

// ✅ GOOD - is pattern for type checking with binding
if (notification is EmailNotification email)
{
    await SendEmailAsync(email.Address, email.Body, ct);
}
```

## Property Patterns

```csharp
// ✅ GOOD - Property pattern for readable conditionals
public decimal CalculateShipping(Order order) => order switch
{
    { TotalAmount: >= 100 }            => 0m,           // free shipping
    { IsExpressDelivery: true }        => 15m,          // express
    { ShippingAddress.Country: "FI" }  => 5m,           // domestic
    _                                  => 10m           // international
};
```

## Deconstruction

```csharp
// ✅ GOOD - Deconstruct tuples and records
var (firstName, lastName) = GetFullName(userId);
var (lat, lon) = location;

// ✅ GOOD - Discard unused parts
var (id, _, createdAt) = GetOrderSummary(orderId);
```

**Related**: `core/standards/csharp/overview.md`