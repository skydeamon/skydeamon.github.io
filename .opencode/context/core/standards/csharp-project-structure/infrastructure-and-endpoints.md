<!-- Context: core/standards/csharp-project-structure/infrastructure-and-endpoints | Priority: critical | Version: 1.3 | Updated: 2026-09-11 -->

# C# Infrastructure & API Endpoints

## API Endpoints (Entry Points)

Endpoint files live in the `Api/` directory at the project root — they are the entry points for discovering business processes. These files handle HTTP concerns only: routing, parameter binding, response shaping, and dispatching to MediatR. No business logic here.

```csharp
// Api/OrderEndpoints.cs
namespace MyApi.Api;

public static class OrderEndpoints
{
    public static void MapOrderEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/orders")
                       .WithTags("Orders")
                       .WithOpenApi()
                       .RequireAuthorization();

        group.MapGet("/",        GetAllOrders).WithName("GetAllOrders");
        group.MapGet("/{id}",    GetOrder)    .WithName("GetOrder");
        group.MapPost("/",       CreateOrder) .WithName("CreateOrder");
        group.MapDelete("/{id}", CancelOrder) .WithName("CancelOrder");
    }

    // Command/Query records are bound directly from HTTP — no mapping needed
    // Use ISender (not IMediator) — exposes only Send/CreateStream

    private static async Task<Ok<List<OrderResult>>> GetAllOrders(
        ISender sender, CancellationToken ct)
        => TypedResults.Ok(await sender.Send(new GetAllOrdersQuery(), ct));

    private static async Task<Results<Ok<OrderResult>, NotFound>> GetOrder(
        Guid id, ISender sender, CancellationToken ct)
    {
        var result = await sender.Send(new GetOrderQuery(id), ct);
        return result is not null ? TypedResults.Ok(result) : TypedResults.NotFound();
    }

    private static async Task<Results<Created<CreatedOrderResult>, ValidationProblem>> CreateOrder(
        CreateOrderCommand command, ISender sender, CancellationToken ct)
    {
        try
        {
            var order = await sender.Send(command, ct);
            return TypedResults.Created($"/orders/{order.Id}", order);
        }
        catch (ValidationException ex)
        {
            return TypedResults.ValidationProblem(ex.ToDictionary());
        }
    }

    private static async Task<Results<NoContent, NotFound>> CancelOrder(
        Guid id, ISender sender, CancellationToken ct)
    {
        var cancelled = await sender.Send(new CancelOrderCommand(id), ct);
        return cancelled ? TypedResults.NoContent() : TypedResults.NotFound();
    }
}
```

## InfrastructureExtensions

```csharp
// Infrastructure/Extensions/InfrastructureExtensions.cs
namespace MyApi.Infrastructure.Extensions;

public static class InfrastructureExtensions
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // ── Database ──────────────────────────────────────────────────────
        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(
                configuration.GetConnectionString("DefaultConnection")
                    ?? throw new InvalidOperationException(
                        "Connection string 'DefaultConnection' not found.")));

        // ── External services ─────────────────────────────────────────────
        services.AddHttpClient<IExternalService, ExternalService>(client =>
        {
            client.BaseAddress = new Uri(
                configuration["ExternalService:BaseUrl"]
                    ?? throw new InvalidOperationException("ExternalService:BaseUrl not configured."));
        });

        services.AddScoped<IEmailService, SmtpEmailService>();

        return services;
    }
}
```

## AppDbContext

```csharp
// Infrastructure/Persistence/AppDbContext.cs
namespace MyApi.Infrastructure.Persistence;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Product> Products => Set<Product>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Auto-discovers all IEntityTypeConfiguration<T> classes in the assembly
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }
}
```

## Entity Configuration

```csharp
// Infrastructure/Persistence/Configurations/OrderConfiguration.cs
namespace MyApi.Infrastructure.Persistence.Configurations;

public sealed class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.ToTable("orders");

        builder.HasKey(o => o.Id);

        builder.Property(o => o.Id)
            .HasDefaultValueSql("gen_random_uuid()");

        builder.Property(o => o.Status)
            .HasConversion<string>()
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(o => o.CreatedAt)
            .HasDefaultValueSql("now()")
            .IsRequired();

        builder.HasQueryFilter(o => !o.IsDeleted);

        builder.HasOne(o => o.User)
            .WithMany(u => u.Orders)
            .HasForeignKey(o => o.UserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
```

**Related**: `core/standards/csharp-project-structure/overview.md`