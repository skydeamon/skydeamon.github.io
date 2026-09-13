<!-- Context: development/principles/api-design/overview | Priority: low | Version: 1.0 | Updated: 2026-09-11 -->

# API Design Patterns — Overview

**Category**: development  
**Purpose**: REST API design principles, GraphQL patterns, and API versioning strategies  
**Used by**: opencoder

## Overview

This guide covers best practices for designing robust, scalable, and maintainable APIs, including REST, GraphQL, and versioning strategies.

## Topics

| File | Covers |
|------|--------|
| `rest.md` | Resource URLs, HTTP methods, status codes, response format, filtering, nesting |
| `graphql.md` | Schema design, resolver patterns, DataLoader |
| `frontend-client.md` | TanStack Query REST integration |
| `versioning.md` | URL/header versioning, deprecation strategy |
| `auth.md` | JWT tokens, role-based access control |

## Best Practices

1. **Use HTTPS everywhere** - Encrypt all API traffic
2. **Implement rate limiting** - Prevent abuse and ensure fair usage
3. **Validate all inputs** - Never trust client data
4. **Use proper error handling** - Return meaningful error messages
5. **Document your API** - Use OpenAPI/Swagger or GraphQL introspection
6. **Version your API** - Plan for breaking changes
7. **Implement CORS properly** - Configure allowed origins carefully
8. **Log requests and errors** - Enable debugging and monitoring
9. **Use caching** - Implement ETags, Cache-Control headers
10. **Test thoroughly** - Unit, integration, and contract tests

## Anti-Patterns

- ❌ **Exposing internal IDs** - Use UUIDs or opaque identifiers
- ❌ **Returning too much data** - Support field selection
- ❌ **Ignoring idempotency** - PUT/PATCH/DELETE should be idempotent
- ❌ **Inconsistent naming** - Use camelCase or snake_case consistently
- ❌ **Missing pagination** - Always paginate collections
- ❌ **No rate limiting** - Protect against abuse
- ❌ **Verbose error messages** - Don't leak implementation details
- ❌ **Synchronous long operations** - Use async jobs for long tasks

## References

- REST API Design Rulebook by Mark Masse
- GraphQL Best Practices (graphql.org)
- API Design Patterns by JJ Geewax
- OpenAPI Specification (swagger.io)