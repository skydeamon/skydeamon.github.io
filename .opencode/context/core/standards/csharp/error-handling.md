<!-- Context: core/standards/csharp/error-handling | Priority: critical | Version: 1.1 | Updated: 2026-09-11 -->

# C# Error Handling

## Use Specific Exception Types

```csharp
// ✅ GOOD - Specific, meaningful exceptions
public async Task<User> GetUserAsync(Guid userId, CancellationToken ct = default)
{
    var user = await _repository.FindAsync(userId, ct);
    if (user is null)
        throw new NotFoundException($"User '{userId}' was not found.");
    return user;
}

// ✅ GOOD - Domain exception hierarchy
public class DomainException : Exception
{
    public DomainException(string message) : base(message) { }
    public DomainException(string message, Exception inner) : base(message, inner) { }
}

public class NotFoundException : DomainException
{
    public NotFoundException(string message) : base(message) { }
}

public class ValidationException : DomainException
{
    public IReadOnlyList<string> Errors { get; }

    public ValidationException(IReadOnlyList<string> errors)
        : base("One or more validation errors occurred.")
        => Errors = errors;
}

// ❌ AVOID - Generic exceptions with no context
throw new Exception("Not found");
throw new ApplicationException("Something went wrong");
```

## Validate at Entry Points

```csharp
// ✅ GOOD - Fail fast with guard clauses
public void PlaceOrder(Order order, Guid userId)
{
    ArgumentNullException.ThrowIfNull(order);
    ArgumentNullException.ThrowIfNull(userId);

    if (order.Items.Count == 0)
        throw new ValidationException(["Order must contain at least one item."]);

    if (order.TotalAmount <= 0)
        throw new ValidationException(["Order total must be greater than zero."]);

    // proceed with valid input
}
```

## Result Pattern (for Expected Failures)

```csharp
// ✅ GOOD - Use Result<T> when failure is a normal outcome (not exceptional)
public readonly record struct Result<T>
{
    public bool IsSuccess { get; }
    public T? Value { get; }
    public string? Error { get; }

    private Result(bool isSuccess, T? value, string? error)
    {
        IsSuccess = isSuccess;
        Value = value;
        Error = error;
    }

    public static Result<T> Success(T value) => new(true, value, null);
    public static Result<T> Failure(string error) => new(false, default, error);
}

// Usage
public Result<Order> SubmitOrder(Cart cart)
{
    if (!cart.HasItems)
        return Result<Order>.Failure("Cart is empty.");

    var order = CreateOrderFromCart(cart);
    return Result<Order>.Success(order);
}

var result = SubmitOrder(cart);
if (result.IsSuccess)
    Console.WriteLine($"Order created: {result.Value!.Id}");
else
    Console.WriteLine($"Failed: {result.Error}");

// Reserve exceptions for truly exceptional, unexpected conditions.
// Use Result<T> for expected business failures (validation, not found in context of search, etc.)
```

## Catch Specific Exceptions

```csharp
// ✅ GOOD - Catch what you can handle
try
{
    await _paymentGateway.ChargeAsync(amount, ct);
}
catch (PaymentDeclinedException ex)
{
    _logger.LogWarning(ex, "Payment declined for amount {Amount}", amount);
    return Result<Receipt>.Failure("Payment was declined.");
}
catch (TimeoutException ex)
{
    _logger.LogError(ex, "Payment gateway timed out");
    throw; // re-throw: let caller or middleware handle retries
}

// ❌ AVOID - Swallowing exceptions silently
try { await _paymentGateway.ChargeAsync(amount, ct); }
catch { }

// ❌ AVOID - Catching Exception broadly without re-throw
catch (Exception ex)
{
    _logger.LogError(ex, "Error");
    return null; // hides the real problem
}
```

**Related**: `core/standards/csharp/overview.md`