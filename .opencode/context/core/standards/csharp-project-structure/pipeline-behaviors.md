<!-- Context: core/standards/csharp-project-structure/pipeline-behaviors | Priority: critical | Version: 1.3 | Updated: 2026-09-11 -->

# C# Features/Common — Pipeline Behaviors

## LoggingBehavior

```csharp
// Features/Common/Behaviors/LoggingBehavior.cs
namespace MyApi.Features.Common.Behaviors;

public class LoggingBehavior<TRequest, TResponse>(ILogger<LoggingBehavior<TRequest, TResponse>> logger)
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken ct)
    {
        var name = typeof(TRequest).Name;
        logger.LogInformation("Handling {Request}", name);
        var sw = Stopwatch.StartNew();
        try
        {
            var response = await next();
            logger.LogInformation("Handled {Request} in {ElapsedMs}ms", name, sw.ElapsedMilliseconds);
            return response;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error handling {Request} after {ElapsedMs}ms", name, sw.ElapsedMilliseconds);
            throw;
        }
    }
}
```

## ValidationBehavior

```csharp
// Features/Common/Behaviors/ValidationBehavior.cs
namespace MyApi.Features.Common.Behaviors;

public class ValidationBehavior<TRequest, TResponse>(IEnumerable<IValidator<TRequest>> validators)
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken ct)
    {
        if (!validators.Any()) return await next();

        var context = new ValidationContext<TRequest>(request);
        var results = await Task.WhenAll(validators.Select(v => v.ValidateAsync(context, ct)));
        var failures = results.SelectMany(r => r.Errors).Where(f => f is not null).ToList();

        if (failures.Count > 0)
            throw new ValidationException(failures);

        return await next();
    }
}
```

**Related**: `core/standards/csharp-project-structure/overview.md`, `core/standards/csharp-project-structure/program-and-features.md`