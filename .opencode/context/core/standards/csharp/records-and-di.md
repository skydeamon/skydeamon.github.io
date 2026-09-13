<!-- Context: core/standards/csharp/records-and-di | Priority: critical | Version: 1.1 | Updated: 2026-09-11 -->

# C# Records, Immutability & Dependency Injection

## Use Records for Value Objects and DTOs

```csharp
// ✅ GOOD - Record for immutable data (value semantics, built-in equality)
public record UserDto(Guid Id, string Name, string Email);

public record Address(string Street, string City, string PostalCode, string Country);

// ✅ GOOD - Readonly record struct for small value objects (stack allocated)
public readonly record struct Money(decimal Amount, string Currency);
public readonly record struct Coordinates(double Latitude, double Longitude);

// Non-destructive mutation via 'with'
var updated = originalUser with { Email = "new@example.com" };
```

## Immutable Collections

```csharp
// ✅ GOOD - Expose immutable views
public class Order
{
    private readonly List<OrderItem> _items = new();

    public IReadOnlyList<OrderItem> Items => _items.AsReadOnly();

    public void AddItem(OrderItem item)
    {
        ArgumentNullException.ThrowIfNull(item);
        _items.Add(item);
    }
}

// ✅ GOOD - ImmutableList for truly immutable scenarios
using System.Collections.Immutable;

public record ShoppingCart(ImmutableList<CartItem> Items)
{
    public ShoppingCart AddItem(CartItem item) =>
        this with { Items = Items.Add(item) };

    public ShoppingCart RemoveItem(Guid itemId) =>
        this with { Items = Items.RemoveAll(i => i.Id == itemId) };
}
```

## init-only Properties

```csharp
// ✅ GOOD - init allows construction but prevents later mutation
public class OrderConfiguration
{
    public Guid OrderId { get; init; }
    public string Currency { get; init; } = "EUR";
    public int MaxItems { get; init; } = 100;
}

// Can set during object initializer, but not after
var config = new OrderConfiguration { OrderId = Guid.NewGuid(), Currency = "USD" };
// config.Currency = "EUR"; // ❌ compile error
```

## Constructor Injection (Preferred)

```csharp
// ✅ GOOD - All dependencies injected through constructor, stored readonly
public class OrderService : IOrderService
{
    private readonly IOrderRepository _repository;
    private readonly IPaymentGateway _paymentGateway;
    private readonly ILogger<OrderService> _logger;

    public OrderService(
        IOrderRepository repository,
        IPaymentGateway paymentGateway,
        ILogger<OrderService> logger)
    {
        _repository = repository;
        _paymentGateway = paymentGateway;
        _logger = logger;
    }
}

// ❌ AVOID - Service locator pattern (hidden dependencies)
public class OrderService
{
    public async Task ProcessAsync()
    {
        var repo = ServiceLocator.Get<IOrderRepository>(); // hidden dependency
    }
}
```

## Lifetime Registration

```csharp
// Registration in Program.cs or an extension method
services.AddScoped<IOrderService, OrderService>();      // per HTTP request
services.AddTransient<IEmailSender, SmtpEmailSender>(); // new instance each time
services.AddSingleton<ICacheService, MemoryCacheService>(); // single instance

// ✅ GOOD - Extension method groups related registrations
public static class OrdersServiceCollectionExtensions
{
    public static IServiceCollection AddOrders(this IServiceCollection services)
    {
        services.AddScoped<IOrderService, OrderService>();
        services.AddScoped<IOrderRepository, OrderRepository>();
        return services;
    }
}

// In Program.cs
builder.Services.AddOrders();
```

## Options Pattern for Configuration

```csharp
// ✅ GOOD - Strongly-typed configuration
public class PaymentOptions
{
    public const string SectionName = "Payment";

    public string ApiKey { get; set; } = string.Empty;
    public string BaseUrl { get; set; } = string.Empty;
    public int TimeoutSeconds { get; set; } = 30;
}

// Registration
builder.Services.Configure<PaymentOptions>(
    builder.Configuration.GetSection(PaymentOptions.SectionName));

// Usage
public class PaymentGateway
{
    private readonly PaymentOptions _options;

    public PaymentGateway(IOptions<PaymentOptions> options)
    {
        _options = options.Value;
    }
}
```

**Related**: `core/standards/csharp/overview.md`