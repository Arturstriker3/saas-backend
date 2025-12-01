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

## Comandos Rápidos

- Lint: `npm run lint`
- Lint (fix): `npm run lint:fix`
- Typecheck: `npm run typecheck`
- Build: `npm run build`
- Start (dev): `npm run start:dev`
- Start (prod): `npm run start`
- Gerar docs GraphQL: `npm run docs:graphql` (salva em `docs/graphql`)
- Preview docs local: `npm run docs:preview` (usa `DOCS_PORT`, default `3333`)
- App serve docs em: `http://localhost:${PORT}${DOCS_ROUTE}` (defaults: `PORT=3000`, `DOCS_ROUTE=/graphql-docs`)

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
- Variáveis `.env`: `PORT`, `DOCS_ROUTE`, `DOCS_PORT`, `CASSANDRA_*`
