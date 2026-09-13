<!-- Context: development/principles/api-design/auth | Priority: low | Version: 1.0 | Updated: 2026-09-11 -->

# Authentication & Authorization

## 1. JWT Tokens

**Use JWT for stateless auth**:
```javascript
// Token structure
{
  "sub": "user-123",
  "email": "user@example.com",
  "role": "admin",
  "iat": 1516239022,
  "exp": 1516242622
}

// Middleware
function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
```

## 2. Role-Based Access Control

**Implement RBAC**:
```javascript
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
}

// Usage
app.delete('/users/:id', 
  authenticateToken, 
  authorize('admin'), 
  deleteUser
);
```

**Related**: `development/principles/api-design/overview.md`