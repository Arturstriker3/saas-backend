import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { express as voyagerMiddleware } from "graphql-voyager/middleware";
import express from "express";
import { join } from "path";
import {
  CASSANDRA_CLIENT,
  CassandraClient,
} from "./common/database/cassandra.client";
import { loadEnv } from "./common/config/env";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use("/voyager", voyagerMiddleware({ endpointUrl: "/graphql" }));
  const env = loadEnv();
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
  await app.listen(parseInt(env.PORT, 10));
}
bootstrap();
