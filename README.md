# SaaS Backend (NestJS + GraphQL + Cassandra)

## Overview

- NestJS backend with code-first GraphQL and Cassandra.
- Modules: `User`, `Auth`, `Role`.
- Validation: `zod`. Password hashing: `bcrypt`.

## Stack

- Node.js (engine `>=22 <23`)
- NestJS
- GraphQL (Apollo driver)
- Cassandra (optional for dev; refresh tokens stored here)
- Zod

## Setup

- Install dependencies: `pnpm install`
- Approve native builds (bcrypt): `pnpm approve-builds bcrypt`
- Start Cassandra (optional for dev): `docker compose up -d`
- Configure `.env` (defaults exist). Key variables:
  - `NODE_ENV`, `PORT`, `DOCS_ROUTE`, `DOCS_PORT`, `SKIP_DB_CONNECT`
  - `CASSANDRA_CONTACT_POINTS`, `CASSANDRA_PORT`, `CASSANDRA_LOCAL_DATACENTER`, `CASSANDRA_KEYSPACE`
  - `JWT_SECRET`, `JWT_EXPIRES_IN` (seconds), `REFRESH_TOKEN_TTL` (seconds)

## Commands

- Typecheck: `pnpm run typecheck`
- Lint: `pnpm run lint`
- Build: `pnpm run build`
- Start (prod build): `pnpm run start`
- Start (dev): `pnpm run start:dev`
- Generate GraphQL docs: `pnpm run docs:graphql` (outputs to `docs/graphql`)
- Preview docs locally: `pnpm run docs:preview` (uses `DOCS_PORT`, default `3333`)
- App serves docs at: `http://localhost:${PORT}${DOCS_ROUTE}` (defaults: `PORT=3000`, `DOCS_ROUTE=/graphql-docs`)

## GraphQL

- Endpoint: `http://localhost:${PORT}/graphql`
- Voyager: `http://localhost:${PORT}/voyager`

## Authentication Model

- Access Token (JWT):
  - Header: `Authorization: Bearer <accessToken>`
  - Payload: `{ sub: string; role?: 'ADMIN' | 'USER' }`
  - Expiration: `JWT_EXPIRES_IN` seconds
- Refresh Token:
  - Random 32-byte hex string
  - Stored in Cassandra table `refresh_tokens`
  - TTL: `REFRESH_TOKEN_TTL` seconds

### Cassandra Table (Refresh Tokens)

```
CREATE TABLE IF NOT EXISTS refresh_tokens (
  token TEXT PRIMARY KEY,
  user_id UUID,
  created_at TIMESTAMP,
  expires_at TIMESTAMP
);
```

## Guards & RBAC

- `JwtStrategy`: extracts `Bearer` token and populates `request.user = { userId, role }`.
- `GqlAuthGuard`: GraphQL-aware auth guard (`AuthGuard('jwt')`).
- `@Roles(...roles)` decorator and `RolesGuard` enforce RBAC using `request.user.role`.

Example usage in a resolver:

```ts
@UseGuards(GqlAuthGuard, RolesGuard)
@Roles('ADMIN')
@Mutation(() => SomeType)
async secureAction() { /* ... */ }
```

## Service Auth Mapping

- Auth
  - `login(input: { email, password }) -> AuthPayload`
    - Access: Public
  - `refreshToken(input: { refreshToken }) -> AuthPayload`
    - Access: Public (requires valid refresh token)
  - `logout(input: { refreshToken }) -> Boolean`
    - Access: Public (requires valid refresh token)

- User
  - `users(): [User]`
    - Recommended: `@UseGuards(GqlAuthGuard)`
    - Current enforcement: Not applied
  - `createUser(input: CreateUserInput): User`
    - Recommended: `@UseGuards(GqlAuthGuard, RolesGuard) @Roles('ADMIN')`
    - Current enforcement: Not applied
  - `activateUser(input: { id }): User`
    - Recommended: `@UseGuards(GqlAuthGuard, RolesGuard) @Roles('ADMIN')`
    - Current enforcement: Not applied
  - `deactivateUser(input: { id }): User`
    - Recommended: `@UseGuards(GqlAuthGuard, RolesGuard) @Roles('ADMIN')`
    - Current enforcement: Not applied
  - `changeUserName(input: { id, name }): User`
    - Recommended: `@UseGuards(GqlAuthGuard)` and enforce self-only update
    - Current enforcement: Not applied
  - `changeUserPassword(input: { id, newPasswordHash }): User`
    - Recommended: `@UseGuards(GqlAuthGuard)` and enforce self-only update
    - Current enforcement: Not applied

## Token Rotation

- `refreshToken` mutation rotates the refresh token:
  - Deletes the provided refresh token
  - Issues a new refresh token and access token

## Development Notes

- Initial persistence uses in-memory maps for `User`; Cassandra is used for refresh tokens.
- Set `SKIP_DB_CONNECT=true` to run without Cassandra during development.
- Engine warnings may appear if your Node version differs from `engines` config; use Node 22 for consistency.
