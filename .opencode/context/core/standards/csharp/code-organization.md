<!-- Context: core/standards/csharp/code-organization | Priority: critical | Version: 1.1 | Updated: 2026-09-11 -->

# C# Code Organization

## Namespace Per Feature (not per type)

```csharp
// ✅ GOOD - Feature-based namespaces
namespace MyApp.Orders;          // all order-related types together
namespace MyApp.Users;           // all user-related types together
namespace MyApp.Notifications;

// ❌ AVOID - Layer-based namespaces that scatter a feature across the codebase
namespace MyApp.Repositories;
namespace MyApp.Services;
namespace MyApp.Controllers;
```

## File-Scoped Namespaces

```csharp
// ✅ GOOD - File-scoped namespace (C# 10+): less indentation
namespace MyApp.Orders;

public class OrderService { }

// ❌ AVOID - Block-scoped namespace adds unnecessary indentation
namespace MyApp.Orders
{
    public class OrderService { }
}
```

## One Type Per File

```csharp
// ✅ GOOD - OrderService.cs contains only OrderService
// ✅ ACCEPTABLE - Small, closely related types in one file (e.g., value objects + their exceptions)

// ❌ AVOID - Multiple unrelated types in one file
// OrderService.cs containing OrderService + UserService + ProductRepository
```

## Using Directives

```csharp
// ✅ GOOD - Global usings for commonly used namespaces (in a GlobalUsings.cs file)
global using System;
global using System.Collections.Generic;
global using System.Threading;
global using System.Threading.Tasks;
global using Microsoft.Extensions.Logging;

// ✅ GOOD - File-level usings at the top, outside namespace
using System.Text.Json;
using MyApp.Common;

namespace MyApp.Orders;
```

## Class Structure Order

Follow this order within a class:

```csharp
public class OrderService : IOrderService
{
    // 1. Constants
    private const int MaxRetryCount = 3;

    // 2. Static fields
    private static readonly JsonSerializerOptions JsonOptions = new();

    // 3. Instance fields (private)
    private readonly IOrderRepository _repository;
    private readonly ILogger<OrderService> _logger;

    // 4. Constructor(s)
    public OrderService(IOrderRepository repository, ILogger<OrderService> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    // 5. Properties

    // 6. Public methods

    // 7. Private methods
}
```

**Related**: `core/standards/csharp/overview.md`