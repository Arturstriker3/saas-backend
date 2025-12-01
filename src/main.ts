import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger } from "@nestjs/common";
import { express as voyagerMiddleware } from "graphql-voyager/middleware";
import express from "express";
import { join } from "path";
import {
  CASSANDRA_CLIENT,
  CassandraClient,
} from "./common/database/cassandra.client";
import { loadEnv } from "./common/config/env";
import { runMigrations } from "./common/database/migration-runner";
import { runSeed } from "./common/database/seed/seed";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use("/voyager", voyagerMiddleware({ endpointUrl: "/graphql" }));
  const env = loadEnv();
  if (env.RUN_MIGRATIONS_ON_STARTUP === "true") {
    await runMigrations();
  }
  if (env.RUN_SEED_ON_STARTUP === "true") {
    await runSeed();
  }
  if (env.SKIP_DB_CONNECT !== "true") {
    const cassandra = app.get<CassandraClient>(CASSANDRA_CLIENT);
    try {
      await cassandra.connect();
    } catch (err) {
      console.error("Failed to connect to Cassandra:", err);
      process.exit(1);
    }
  }
  app.use(env.DOCS_ROUTE, express.static(join(process.cwd(), "docs/graphql")));
  if (env.RUN_MIGRATIONS_ON_STARTUP === "true") {
    await runMigrations();
  }
  if (env.RUN_SEED_ON_STARTUP === "true") {
    await runSeed();
  }
  await app.listen(parseInt(env.PORT, 10));
  const base = `http://localhost:${parseInt(env.PORT, 10)}`;
  Logger.log(`API listening on ${base}`, "Bootstrap");
  Logger.log(`GraphQL Playground: ${base}/graphql`, "Bootstrap");
  Logger.log(`GraphQL Voyager: ${base}/voyager`, "Bootstrap");
  Logger.log(`Docs: ${base}${env.DOCS_ROUTE}`, "Bootstrap");
}
bootstrap();
