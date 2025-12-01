# SaaS Backend (NestJS + GraphQL + Cassandra)

## Stack
- Node.js
- NestJS
- GraphQL (code-first)
- Cassandra (Docker)
- Zod for validation

## Setup
- Install dependencies: `npm install`
- Start Cassandra: `docker compose up -d`
- Ensure `.env` is configured (defaults provided)

## Run
- Development: `npm run start:dev`
- Build: `npm run build`
- Production: `npm run start`

## GraphQL
- Endpoint: `http://localhost:3000/graphql`

### Sample Operations
Query examples:
```
query {
  examples { id name createdAt }
}
```

Create example:
```
mutation {
  createExample(input: { name: "Hello" }) { id name createdAt }
}
```

## Notes
- Repository uses in-memory storage initially. Cassandra client is wired for future persistence.
