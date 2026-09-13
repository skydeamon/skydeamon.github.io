<!-- Context: core/standards/csharp/overview | Priority: critical | Version: 1.1 | Updated: 2026-09-11 -->

# C# Standards — Overview

**Purpose**: Universal C# best practices for AI agents working on .NET projects
**Scope**: Language-level patterns, not framework-specific

## Topics

| File | Covers |
|------|--------|
| `naming.md` | Naming conventions (types, methods, fields, interfaces) |
| `types-and-nullability.md` | Nullable reference types, null handling, primitive obsession |
| `async-and-linq.md` | CancellationToken, async patterns, LINQ usage |
| `error-handling.md` | Specific exceptions, entry validation, Result pattern |
| `pattern-matching.md` | Switch expressions, type/property patterns, deconstruction |
| `code-organization.md` | Namespaces, file-scoped, one type per file, class order |
| `records-and-di.md` | Records, immutability, dependency injection, Options pattern |
| `testing.md` | xUnit + Shouldly + NSubstitute, parameterized tests, integration |

## Quick Reference

| Topic | Key Rule |
|-------|---------|
| Naming | PascalCase methods/properties, `_camelCase` fields, `I`-prefix interfaces, `Async` suffix |
| Nullability | Enable `<Nullable>enable</Nullable>`, use `?` explicitly, guard with `ArgumentNullException.ThrowIfNull` |
| Async | Always pass `CancellationToken`, avoid `async void`, prefer `Task.WhenAll` for parallel ops |
| LINQ | Materialize with `ToList()` once, use `Any()` not `Count() > 0` |
| Errors | Specific exception types, validate at entry, `Result<T>` for expected failures |
| Pattern matching | Switch expressions over switch statements, property patterns for readable conditionals |
| Organization | File-scoped namespaces, feature-based folders, one type per file |
| Immutability | Records for value objects/DTOs, `IReadOnlyList` for exposed collections |
| DI | Constructor injection, `readonly` fields, Options pattern for config |
| Testing | xUnit + Shouldly, `[Fact]`/`[Theory]`, Arrange-Act-Assert, no logic in tests |

**Related**: `core/standards/csharp-project-structure/` (project layout, EF Core, migrations)