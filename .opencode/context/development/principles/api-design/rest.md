<!-- Context: development/principles/api-design/rest | Priority: low | Version: 1.0 | Updated: 2026-09-11 -->

# REST API Design

## 1. Resource-Based URLs

**Use nouns, not verbs**:
```
# Bad
GET  /getUsers
POST /createUser
POST /updateUser/123

# Good
GET    /users
POST   /users
PUT    /users/123
PATCH  /users/123
DELETE /users/123
```

## 2. HTTP Methods

**Use appropriate HTTP methods**:
- `GET` - Retrieve resources (idempotent, safe)
- `POST` - Create new resources
- `PUT` - Replace entire resource (idempotent)
- `PATCH` - Partial update (idempotent)
- `DELETE` - Remove resource (idempotent)

## 3. Status Codes

**Use standard HTTP status codes**:
```
2xx Success
  200 OK - Successful GET, PUT, PATCH
  201 Created - Successful POST
  204 No Content - Successful DELETE

4xx Client Errors
  400 Bad Request - Invalid input
  401 Unauthorized - Missing/invalid auth
  403 Forbidden - Authenticated but not authorized
  404 Not Found - Resource doesn't exist
  409 Conflict - Resource conflict (e.g., duplicate)
  422 Unprocessable Entity - Validation errors

5xx Server Errors
  500 Internal Server Error - Unexpected error
  503 Service Unavailable - Temporary unavailability
```

## 4. Consistent Response Format

**Standardize response structure**:
```json
// Success response
{
  "data": {
    "id": "123",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "meta": {
    "timestamp": "2024-01-01T00:00:00Z"
  }
}

// Error response
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  },
  "meta": {
    "timestamp": "2024-01-01T00:00:00Z",
    "requestId": "abc-123"
  }
}

// Collection response
{
  "data": [...],
  "meta": {
    "total": 100,
    "page": 1,
    "pageSize": 20,
    "totalPages": 5
  },
  "links": {
    "self": "/users?page=1",
    "next": "/users?page=2",
    "prev": null,
    "first": "/users?page=1",
    "last": "/users?page=5"
  }
}
```

## 5. Filtering, Sorting, Pagination

**Support common query operations**:
```
# Filtering
GET /users?status=active&role=admin

# Sorting
GET /users?sort=createdAt:desc,name:asc

# Pagination
GET /users?page=2&pageSize=20

# Field selection
GET /users?fields=id,name,email

# Search
GET /users?q=john
```

## 6. Nested Resources

**Handle relationships appropriately**:
```
# Good - Shallow nesting
GET /users/123/posts
GET /posts?userId=123

# Avoid - Deep nesting
GET /users/123/posts/456/comments/789
# Better
GET /comments/789
```

**Related**: `development/principles/api-design/overview.md`