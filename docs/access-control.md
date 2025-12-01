# Access Control Matrix

Visual map of who can access endpoints and GraphQL operations.

## Endpoints

| Endpoint | Access | Notes |
|---|---|---|
| `/graphql` | Public | Operations may require auth per resolver |
| `/voyager` | Public | Schema visualization |
| `/graphql-docs` | Public | Static docs preview |

## GraphQL Operations

| Operation | Type | Access | Notes |
|---|---|---|---|
| `login(email, password)` | Mutation | Public | Issues access + refresh tokens |
| `refreshToken(refreshToken)` | Mutation | Public | Valid refresh token required |
| `logout(refreshToken)` | Mutation | Public | Valid refresh token required |
| `requestPasswordReset(email)` | Mutation | Public | Sends reset token by email |
| `confirmPasswordReset(token, newPassword)` | Mutation | Public | Resets password if token valid |
| `users()` | Query | Admin | List users |
| `createUser(input)` | Mutation | Admin | Create user |
| `activateUser(id)` | Mutation | Admin | Activate user |
| `deactivateUser(id)` | Mutation | Admin | Deactivate user |
| `changeUserName(id, name)` | Mutation | Auth (self) / Admin | Self-only or admin override |
| `changeUserPassword(id, newPasswordHash)` | Mutation | Auth (self) | Self-only |

Notes:
- Access reflects the intended policy. Enforcement depends on applying guards (`GqlAuthGuard`, `RolesGuard`) on resolvers.
