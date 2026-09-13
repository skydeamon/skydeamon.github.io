<!-- Context: core/standards/csharp-project-structure/initialization-and-layout | Priority: critical | Version: 1.3 | Updated: 2026-09-11 -->

# C# Project Initialization & Layout

## Project Initialization

**Always run these commands FIRST when creating a new ASP.NET Core project:**

```bash
# Create .gitignore (C# patterns)
dotnet new gitignore

# Create .gitattributes (normalize line endings)
dotnet new gitattributes

# Create the project
dotnet new web -n MyApi
cd MyApi
```

**Why this order?**
- `.gitignore` must exist before any build artifacts are created (prevents committing `bin/`, `obj/`, etc.)
- `.gitattributes` ensures consistent line endings across team members
- Projects created after these are in place benefit from proper version control setup

## Project Layout

```
MyApi/
├── Program.cs                          # DI wiring + endpoint mapping only
├── MyApi.csproj
│
├── Api/                                # Endpoint entry points — discover processes here
│   ├── OrderEndpoints.cs               # IEndpointRouteBuilder extension — all /orders routes
│   ├── UserEndpoints.cs
│   └── ProductEndpoints.cs
│
├── Features/                           # Pure business logic — no HTTP/framework code
│   ├── Orders/
│   │   ├── CreateOrder.cs              # Command + Validator + Handler (co-located)
│   │   ├── GetOrder.cs                 # Query + Handler
│   │   ├── GetAllOrders.cs             # Query + Handler
│   │   └── CancelOrder.cs             # Command + Handler + Domain Event
│   │
│   ├── Users/
│   │   ├── CreateUser.cs
│   │   └── GetUser.cs
│   │
│   ├── Products/
│   │   └── CreateProduct.cs
│   │
│   └── Common/                         # Shared feature-level concerns
│       ├── Behaviors/
│       │   ├── LoggingBehavior.cs
│       │   └── ValidationBehavior.cs
│       └── Exceptions/
│           ├── NotFoundException.cs
│           └── ValidationException.cs
│
├── Infrastructure/                     # All framework/technical wiring (non-endpoint)
│   ├── Persistence/
│   │   ├── AppDbContext.cs
│   │   ├── Configurations/             # IEntityTypeConfiguration<T> classes
│   │   │   ├── OrderConfiguration.cs
│   │   │   └── UserConfiguration.cs
│   │   └── Migrations/                 # EF Core migrations (auto-generated)
│   ├── Services/                       # External HTTP clients, email, storage, etc.
│   └── Extensions/
│       └── InfrastructureExtensions.cs # AddInfrastructure() registration
│
├── Domain/                             # Optional: rich domain model (for DDD projects)
│   ├── Entities/
│   └── Events/
│
├── appsettings.json
├── appsettings.Development.json
└── GlobalUsings.cs                     # global using directives
```

**Related**: `core/standards/csharp-project-structure/overview.md`