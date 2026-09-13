<!-- Context: development/principles/api-design/frontend-client | Priority: low | Version: 1.0 | Updated: 2026-09-11 -->

# Frontend API Client Patterns (TanStack Query)

**Use TanStack Query for optimal client-side API consumption**:

## REST Integration
```javascript
// Optimal REST client with TanStack Query v5
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const apiClient = {
  getUsers: (filters) => 
    fetch(`/api/v1/users?${new URLSearchParams(filters)}`).then(r => r.json())
};

function UsersList() {
  const { data, isPending, error } = useQuery({
    queryKey: ['users', filters],
    queryFn: () => apiClient.getUsers(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return (
    <div>
      {isPending && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {data?.data.map(user => <UserCard key={user.id} user={user} />)}
    </div>
  );
}
```

**Related**: `development/principles/api-design/overview.md`