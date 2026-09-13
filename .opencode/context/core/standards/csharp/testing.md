<!-- Context: core/standards/csharp/testing | Priority: critical | Version: 1.1 | Updated: 2026-09-11 -->

# C# Testing Standards

## Framework & Structure

**Use xUnit** as the default test framework. Use **Shouldly** for readable assertions. Use **NSubstitute** for mocking (pragmatic, readable syntax). Use **Moq** only for scenarios requiring strict mock behavior or complex verification.

```csharp
// ✅ GOOD - xUnit test class structure with NSubstitute
public class OrderServiceTests
{
    // Arrange shared fixtures in constructor or use class fixtures
    private readonly IOrderRepository _repositorySubstitute = Substitute.For<IOrderRepository>();
    private readonly ILogger<OrderService> _loggerSubstitute = Substitute.For<ILogger<OrderService>>();
    private readonly OrderService _sut;

    public OrderServiceTests()
    {
        _sut = new OrderService(_repositorySubstitute, _loggerSubstitute);
    }

    [Fact]
    public async Task GetOrderAsync_WhenOrderExists_ReturnsOrder()
    {
        // Arrange
        var orderId = Guid.NewGuid();
        var expected = new Order { Id = orderId };
        _repositorySubstitute
            .FindAsync(orderId, Arg.Any<CancellationToken>())
            .Returns(Task.FromResult<Order?>(expected));

        // Act
        var result = await _sut.GetOrderAsync(orderId);

        // Assert
        result.ShouldBeEquivalentTo(expected);
    }

    [Fact]
    public async Task GetOrderAsync_WhenOrderNotFound_ThrowsNotFoundException()
    {
        // Arrange
        var orderId = Guid.NewGuid();
        _repositorySubstitute
            .FindAsync(orderId, Arg.Any<CancellationToken>())
            .Returns(Task.FromResult<Order?>(null));

        // Act
        var act = () => _sut.GetOrderAsync(orderId);

        // Assert
        await act.ShouldThrowAsync<NotFoundException>();
    }

    [Fact]
    public async Task SaveOrderAsync_CallsRepository_VerifiesInteraction()
    {
        // Arrange
        var order = new Order { Id = Guid.NewGuid() };

        // Act
        await _sut.SaveOrderAsync(order);

        // Assert
        await _repositorySubstitute.Received(1).SaveAsync(order, Arg.Any<CancellationToken>());
    }
}
```

**Why NSubstitute?**
- ✅ Fluent, readable syntax — substitutes ARE the interfaces, no `.Object` indirection
- ✅ Lower ceremony, less noise in tests
- ✅ `Arg.Any<T>()` is cleaner than `It.IsAny<T>()`
- ✅ `Received()` reads naturally as "verify it received this call"
- ✅ Faster to write and understand, even for complex scenarios

## When to Use Moq Instead of NSubstitute

While **NSubstitute is the default**, use **Moq** for:

```csharp
// Use Moq when you need MockBehavior.Strict (fail on unexpected calls)
var mockRepository = new Mock<IOrderRepository>(MockBehavior.Strict);
mockRepository.Setup(r => r.GetOrderAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
    .ReturnsAsync(new Order());

// Use Moq for verifying complex call sequences
var sequence = new MockSequence();
_serviceA.InSequence(sequence).Setup(x => x.MethodA()).ReturnsAsync(true);
_serviceB.InSequence(sequence).Setup(x => x.MethodB()).ReturnsAsync(false);

// Use Moq for verifying no other calls were made
mock.VerifyNoOtherCalls();

// Use Moq for mocking protected members
mock.Protected().Setup<string>("GetName").Returns("test");
```

**Note**: NSubstitute covers ~95% of real-world test scenarios. Only reach for Moq's advanced features if NSubstitute doesn't provide what you need.

## Parameterized Tests

```csharp
// ✅ GOOD - Theory with InlineData for multiple cases
[Theory]
[InlineData(CustomerTier.Bronze, 0.00)]
[InlineData(CustomerTier.Silver, 0.05)]
[InlineData(CustomerTier.Gold, 0.10)]
[InlineData(CustomerTier.Platinum, 0.20)]
public void GetDiscount_ReturnsCorrectRate(CustomerTier tier, decimal expected)
{
    var result = _sut.GetDiscount(tier);
    result.ShouldBe(expected);
}

// ✅ GOOD - MemberData for complex input objects
public static IEnumerable<object[]> InvalidOrders =>
[
    [new Order { Items = [] }, "Order must contain at least one item."],
    [new Order { Items = [item], TotalAmount = -1 }, "Order total must be greater than zero."],
];

[Theory]
[MemberData(nameof(InvalidOrders))]
public void PlaceOrder_WithInvalidOrder_ThrowsValidationException(Order order, string expectedError)
{
    var act = () => _sut.PlaceOrder(order, Guid.NewGuid());
    act.ShouldThrow<ValidationException>()
        .Errors.ShouldContain(expectedError);
}
```

## Test Naming

```csharp
// ✅ GOOD - MethodName_StateUnderTest_ExpectedBehavior
public async Task GetOrderAsync_WhenOrderExists_ReturnsOrder() { }
public async Task GetOrderAsync_WhenOrderNotFound_ThrowsNotFoundException() { }
public void PlaceOrder_WithEmptyCart_ThrowsValidationException() { }
public void CalculateDiscount_ForPlatinumCustomer_Returns20Percent() { }
```

## Avoid Logic in Tests

```csharp
// ✅ GOOD - Direct, no conditionals or loops
[Fact]
public void FormatName_ReturnsFullName()
{
    var user = new User { FirstName = "John", LastName = "Doe" };
    var result = _sut.FormatName(user);
    result.ShouldBe("John Doe");
}

// ❌ AVOID - Logic in tests (makes failures hard to diagnose)
[Fact]
public void FormatNames_ReturnsFullNames()
{
    var users = GetTestUsers();
    foreach (var user in users)
    {
        if (user.FirstName != null)
            _sut.FormatName(user).ShouldContain(user.FirstName);
    }
}
```

## Integration Tests

```csharp
// ✅ GOOD - Use WebApplicationFactory for ASP.NET Core integration tests
public class OrdersApiTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public OrdersApiTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.WithWebHostBuilder(builder =>
        {
            builder.ConfigureServices(services =>
            {
                // Replace real DB with in-memory for tests
                services.RemoveAll<DbContext>();
                services.AddDbContext<AppDbContext>(o => o.UseInMemoryDatabase("TestDb"));
            });
        }).CreateClient();
    }

    [Fact]
    public async Task GetOrder_ReturnsOk()
    {
        var response = await _client.GetAsync("/api/orders/123");
        response.StatusCode.ShouldBe(HttpStatusCode.OK);
    }
}
```

**Related**: `core/standards/csharp/overview.md`, `core/standards/test-coverage.md`