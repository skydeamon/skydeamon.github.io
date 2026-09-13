<!-- Context: core/standards/csharp-project-structure/efcore-and-migrations | Priority: critical | Version: 1.3 | Updated: 2026-09-11 -->

# C# EF Core & PostgreSQL Patterns

## Connection String (appsettings.json)

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=myapp;Username=postgres;Password=yourpassword"
  }
}
```

Override in environment / Docker / Kubernetes using double-underscore notation:
```
ConnectionStrings__DefaultConnection=Host=prod-db;...
```

For local development, use `dotnet user-secrets`:
```bash
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=localhost;..."
```

## Async Query Patterns

```csharp
// ✅ Always pass CancellationToken to all EF async methods
var orders = await db.Orders
    .AsNoTracking()                       // read-only queries: skip change tracking
    .Where(o => o.UserId == userId)
    .OrderByDescending(o => o.CreatedAt)
    .ToListAsync(ct);

// ✅ FindAsync for primary key lookup (uses change tracker cache first)
var order = await db.Orders.FindAsync([orderId], ct);

// ✅ Bulk update / delete without loading entities (EF 7+)
await db.Orders
    .Where(o => o.Status == OrderStatus.Pending && o.CreatedAt < cutoff)
    .ExecuteUpdateAsync(s => s.SetProperty(o => o.Status, OrderStatus.Expired), ct);

await db.Orders
    .Where(o => o.IsDeleted && o.CreatedAt < cutoff)
    .ExecuteDeleteAsync(ct);
```

## AsNoTracking

```csharp
// ✅ Use AsNoTracking for all read/query handlers — no change tracker overhead
var result = await db.Orders
    .AsNoTracking()
    .Where(o => o.Id == id)
    .Select(o => new OrderResult(o.Id, o.UserId, o.Status, o.CreatedAt))
    .FirstOrDefaultAsync(ct);

// ✅ Omit AsNoTracking in command handlers that modify and call SaveChangesAsync
var order = await db.Orders.FindAsync([id], ct);
order!.Status = OrderStatus.Shipped;
await db.SaveChangesAsync(ct);
```

## Migrations

### Common Commands

```bash
# Add a new migration after model changes
dotnet ef migrations add MigrationName

# Apply pending migrations to the database
dotnet ef database update

# List all migrations and their applied status
dotnet ef migrations list

# Remove the last unapplied migration
dotnet ef migrations remove

# Multi-project setup (DbContext in separate library)
dotnet ef migrations add MigrationName \
  --project src/MyApp.Data \
  --startup-project src/MyApp.Api
```

### Production Deployment

```bash
# Generate idempotent SQL script — safe to run multiple times (recommended for CI/CD)
dotnet ef migrations script --idempotent --output migrations.sql

# EF 9: self-contained migration bundle (no dotnet SDK needed at deploy time)
dotnet ef migrations bundle --output migrations-bundle
./migrations-bundle --connection "${DB_CONNECTION_STRING}"
```

> **Do not** auto-migrate in `Program.cs` (`db.Database.MigrateAsync()`) in production multi-instance deployments — use SQL scripts or migration bundles instead to avoid race conditions.

**Related**: `core/standards/csharp-project-structure/overview.md`