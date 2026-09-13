<!-- Context: core/standards/csharp-project-structure/packages-and-globalusings | Priority: critical | Version: 1.3 | Updated: 2026-09-11 -->

# C# NuGet Packages & GlobalUsings

## NuGet Packages

```xml
<ItemGroup>
  <!-- Minimal API + ASP.NET Core (included via SDK, listed for clarity) -->
  <PackageReference Include="Microsoft.AspNetCore.OpenApi" Version="9.*" />

  <!-- CQRS -->
  <PackageReference Include="MediatR" Version="12.*" />

  <!-- Validation -->
  <PackageReference Include="FluentValidation.DependencyInjectionExtensions" Version="11.*" />

  <!-- EF Core + PostgreSQL -->
  <PackageReference Include="Npgsql.EntityFrameworkCore.PostgreSQL" Version="9.*" />
  <PackageReference Include="Microsoft.EntityFrameworkCore.Design" Version="9.*" />

  <!-- Testing -->
  <PackageReference Include="xunit" Version="2.*" />
  <PackageReference Include="xunit.runner.visualstudio" Version="2.*" />
  <PackageReference Include="Shouldly" Version="4.*" />
  <PackageReference Include="NSubstitute" Version="5.*" />
  <PackageReference Include="NSubstitute.Analyzers.CSharp" Version="1.*" />
  <PackageReference Include="Microsoft.AspNetCore.Mvc.Testing" Version="9.*" />
  <PackageReference Include="Testcontainers.PostgreSql" Version="3.*" />
</ItemGroup>
```

## GlobalUsings.cs

```csharp
global using System;
global using System.Collections.Generic;
global using System.Linq;
global using System.Threading;
global using System.Threading.Tasks;
global using FluentValidation;
global using MediatR;
global using Microsoft.AspNetCore.Http.HttpResults;
global using Microsoft.AspNetCore.Routing;
global using Microsoft.EntityFrameworkCore;
global using Microsoft.Extensions.Configuration;
global using Microsoft.Extensions.DependencyInjection;
global using Microsoft.Extensions.Logging;
global using MyApi.Infrastructure.Persistence;
global using NSubstitute;
```

**Related**: `core/standards/csharp-project-structure/overview.md`