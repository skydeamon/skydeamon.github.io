<!-- Context: development/principles/api-design/graphql | Priority: low | Version: 1.0 | Updated: 2026-09-11 -->

# GraphQL Patterns

## 1. Schema Design

**Design clear, intuitive schemas**:
```graphql
type User {
  id: ID!
  name: String!
  email: String!
  posts: [Post!]!
  createdAt: DateTime!
}

type Post {
  id: ID!
  title: String!
  content: String!
  author: User!
  comments: [Comment!]!
  publishedAt: DateTime
}

type Query {
  user(id: ID!): User
  users(filter: UserFilter, page: Int, pageSize: Int): UserConnection!
  post(id: ID!): Post
}

type Mutation {
  createUser(input: CreateUserInput!): User!
  updateUser(id: ID!, input: UpdateUserInput!): User!
  deleteUser(id: ID!): Boolean!
}

input CreateUserInput {
  name: String!
  email: String!
}

input UserFilter {
  status: UserStatus
  role: UserRole
  search: String
}
```

## 2. Resolver Patterns

**Implement efficient resolvers**:
```javascript
const resolvers = {
  Query: {
    user: async (_, { id }, { dataSources }) => {
      return dataSources.userAPI.getUser(id);
    },
    users: async (_, { filter, page, pageSize }, { dataSources }) => {
      return dataSources.userAPI.getUsers({ filter, page, pageSize });
    }
  },
  
  User: {
    posts: async (user, _, { dataSources }) => {
      // Use DataLoader to batch requests
      return dataSources.postAPI.getPostsByUserId(user.id);
    }
  },
  
  Mutation: {
    createUser: async (_, { input }, { dataSources, user }) => {
      // Check authorization
      if (!user) throw new AuthenticationError('Not authenticated');
      
      // Validate input
      const validatedInput = validateUserInput(input);
      
      // Create user
      return dataSources.userAPI.createUser(validatedInput);
    }
  }
};
```

## 3. DataLoader for N+1 Prevention

**Batch and cache database queries**:
```javascript
import DataLoader from 'dataloader';

const userLoader = new DataLoader(async (userIds) => {
  const users = await db.users.findMany({
    where: { id: { in: userIds } }
  });
  
  // Return in same order as input
  return userIds.map(id => users.find(u => u.id === id));
});

// Usage in resolver
const user = await userLoader.load(userId);
```

**Related**: `development/principles/api-design/overview.md`