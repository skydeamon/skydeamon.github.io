<!-- Context: core/standards/csharp/naming | Priority: critical | Version: 1.1 | Updated: 2026-09-11 -->

# C# Naming Conventions

## General Rules

| Element | Convention | Example |
|---------|-----------|---------|
| Classes, structs, records | PascalCase | `UserService`, `OrderItem` |
| Interfaces | `I` + PascalCase | `IUserRepository`, `IOrderService` |
| Methods | PascalCase | `GetUserById`, `ProcessOrder` |
| Properties | PascalCase | `FirstName`, `CreatedAt` |
| Fields (private) | `_` + camelCase | `_logger`, `_repository` |
| Local variables | camelCase | `userId`, `orderTotal` |
| Parameters | camelCase | `userId`, `cancellationToken` |
| Constants | PascalCase | `MaxRetryCount`, `DefaultTimeout` |
| Enums | PascalCase (type and members) | `OrderStatus.Pending` |
| Async methods | `Async` suffix | `GetUserAsync`, `SaveOrderAsync` |

## Method Naming

```csharp
// ✅ GOOD - Verb + noun, PascalCase
public async Task<User> GetUserByIdAsync(Guid userId) { }
public async Task<IReadOnlyList<Order>> ListOrdersAsync(Guid userId) { }
public async Task DeleteUserAsync(Guid userId) { }
public bool IsEligibleForDiscount(Order order) { }
public bool HasPermission(string action) { }

// ❌ AVOID - Ambiguous or wrong case
public async Task<User> fetchuser(Guid id) { }
public async Task<User> DoUserGet(Guid id) { }
```

## Interface Naming

```csharp
// ✅ GOOD - Always prefix with I
public interface IUserRepository { }
public interface IOrderService { }
public interface INotificationSender { }

// ❌ AVOID - No prefix, or wrong prefix
public interface UserRepository { }
public interface TUserRepository { }
```

## Private Fields

```csharp
// ✅ GOOD - Underscore prefix, camelCase
public class OrderService
{
    private readonly IOrderRepository _orderRepository;
    private readonly ILogger<OrderService> _logger;
    private int _retryCount;
}

// ❌ AVOID - No prefix, or m_ prefix
private IOrderRepository orderRepository;
private IOrderRepository m_orderRepository;
```

**Related**: `core/standards/csharp/overview.md`