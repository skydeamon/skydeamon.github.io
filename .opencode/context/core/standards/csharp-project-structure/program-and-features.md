<!-- Context: core/standards/csharp-project-structure/program-and-features | Priority: critical | Version: 1.3 | Updated: 2026-09-11 -->

# C# Program.cs & Vertical Slice Features

## Program.cs

`Program.cs` contains **only** DI registration and endpoint mapping. No business logic.

```csharp
// Program.cs
using MyApi.Api;
using MyApi.Infrastructure.Extensions;

var builder = WebApplication.CreateBuilder(args);

// ── Infrastructure (DB, external services) ───────────────────────────────
builder.Services.AddInfrastructure(builder.Configuration);

// ── MediatR (CQRS) ───────────────────────────────────────────────────────
builder.Services.AddMediatR(cfg =>
{
    cfg.RegisterServicesFromAssembly(typeof(Program).Assembly);
    cfg.AddOpenBehavior(typeof(LoggingBehavior<,>));
    cfg.AddOpenBehavior(typeof(ValidationBehavior<,>));
});

// ── Validation ────────────────────────────────────────────────────────────
builder.Services.AddValidatorsFromAssembly(typeof(Program).Assembly);

// ── OpenAPI ───────────────────────────────────────────────────────────────
builder.Services.AddOpenApi();   // .NET 9 native; or Swashbuckle for earlier versions

// ── Auth ──────────────────────────────────────────────────────────────────
builder.Services.AddAuthentication().AddJwtBearer();
builder.Services.AddAuthorization();

// ── Build ─────────────────────────────────────────────────────────────────
var app = builder.Build();

if (app.Environment.IsDevelopment())
    app.MapOpenApi();

app.UseAuthentication();
app.UseAuthorization();

// ── Endpoint registration ─────────────────────────────────────────────────
app.MapOrderEndpoints();
app.MapUserEndpoints();
app.MapProductEndpoints();

app.Run();

public partial class Program { }   // allows WebApplicationFactory in integration tests
```

## Features — Vertical Slices

Each use case lives in its own file: **Command or Query record + Validator + Handler — nothing else**.  
The Command/Query record is the API contract — it is bound directly from the HTTP request body/route.  
No separate DTO types, no mapping layer.

### Command Slice (write operation)

```csharp
// Features/Orders/CreateOrder.cs
namespace MyApi.Features.Orders;

// ── Command = API request contract ───────────────────────────────────────
// Bound directly from HTTP request body. No separate DTO needed.
public record CreateOrderCommand(Guid UserId, List<OrderItem> Items) : IRequest<CreatedOrderResult>;

// Return type is also a record — represents the response shape
public record CreatedOrderResult(Guid Id, Guid UserId, DateTime CreatedAt);

// ── Validator ─────────────────────────────────────────────────────────────
public class CreateOrderValidator : AbstractValidator<CreateOrderCommand>
{
    public CreateOrderValidator()
    {
        RuleFor(x => x.UserId).NotEmpty();
        RuleFor(x => x.Items).NotEmpty().WithMessage("Order must contain at least one item.");
    }
}

// ── Handler ───────────────────────────────────────────────────────────────
public class CreateOrderHandler(AppDbContext db) : IRequestHandler<CreateOrderCommand, CreatedOrderResult>
{
    public async Task<CreatedOrderResult> Handle(CreateOrderCommand cmd, CancellationToken ct)
    {
        var order = new Order
        {
            Id = Guid.NewGuid(),
            UserId = cmd.UserId,
            Items = cmd.Items,
            CreatedAt = DateTime.UtcNow,
        };

        db.Orders.Add(order);
        await db.SaveChangesAsync(ct);

        return new CreatedOrderResult(order.Id, order.UserId, order.CreatedAt);
    }
}
```

### Query Slice (read operation)

```csharp
// Features/Orders/GetOrder.cs
namespace MyApi.Features.Orders;

// ── Query = API request contract ──────────────────────────────────────────
// Route parameter bound directly. Return type is the response shape.
public record GetOrderQuery(Guid Id) : IRequest<OrderResult?>;

public record OrderResult(Guid Id, Guid UserId, OrderStatus Status, DateTime CreatedAt);

// ── Handler ───────────────────────────────────────────────────────────────
public class GetOrderHandler(AppDbContext db) : IRequestHandler<GetOrderQuery, OrderResult?>
{
    public async Task<OrderResult?> Handle(GetOrderQuery query, CancellationToken ct)
        => await db.Orders
            .AsNoTracking()
            .Where(o => o.Id == query.Id)
            .Select(o => new OrderResult(o.Id, o.UserId, o.Status, o.CreatedAt))
            .FirstOrDefaultAsync(ct);
}
```

### Domain Events (INotification)

```csharp
// Features/Orders/CancelOrder.cs
namespace MyApi.Features.Orders;

public record CancelOrderCommand(Guid Id) : IRequest<bool>;

// ── Domain event ──────────────────────────────────────────────────────────
public record OrderCancelledEvent(Guid OrderId) : INotification;

// ── Handler ───────────────────────────────────────────────────────────────
public class CancelOrderHandler(AppDbContext db, IPublisher publisher)
    : IRequestHandler<CancelOrderCommand, bool>
{
    public async Task<bool> Handle(CancelOrderCommand cmd, CancellationToken ct)
    {
        var order = await db.Orders.FindAsync([cmd.Id], ct);
        if (order is null) return false;

        order.Status = OrderStatus.Cancelled;
        await db.SaveChangesAsync(ct);

        await publisher.Publish(new OrderCancelledEvent(order.Id), ct);
        return true;
    }
}

// ── Side-effect handlers (each independent, all run on Publish) ──────────
public class SendCancellationEmailHandler(IEmailService email)
    : INotificationHandler<OrderCancelledEvent>
{
    public async Task Handle(OrderCancelledEvent e, CancellationToken ct)
        => await email.SendCancellationAsync(e.OrderId, ct);
}
```

**Related**: `core/standards/csharp-project-structure/overview.md`, `core/standards/csharp-project-structure/pipeline-behaviors.md`