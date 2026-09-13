<!-- Context: development/principles/api-design/versioning | Priority: low | Version: 1.0 | Updated: 2026-09-11 -->

# API Versioning

## 1. URL Versioning

**Version in the URL path**:
```
GET /v1/users
GET /v2/users
```

**Pros**: Clear, easy to route  
**Cons**: URL changes, harder to maintain multiple versions

## 2. Header Versioning

**Version in Accept header**:
```
GET /users
Accept: application/vnd.myapi.v2+json
```

**Pros**: Clean URLs, flexible  
**Cons**: Less visible, harder to test

## 3. Deprecation Strategy

**Communicate deprecation clearly**:
```javascript
// Response headers
Deprecation: true
Sunset: Sat, 31 Dec 2024 23:59:59 GMT
Link: <https://api.example.com/v2/users>; rel="successor-version"

// Response body
{
  "data": {...},
  "meta": {
    "deprecated": true,
    "deprecationDate": "2024-12-31",
    "migrationGuide": "https://docs.example.com/migration/v1-to-v2"
  }
}
```

**Related**: `development/principles/api-design/overview.md`