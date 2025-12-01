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

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const cassandra = app.get<CassandraClient>(CASSANDRA_CLIENT);
  try {
    await cassandra.connect();
  } catch (err) {
    console.error("Failed to connect to Cassandra:", err);
    process.exit(1);
  }
  app.use("/voyager", voyagerMiddleware({ endpointUrl: "/graphql" }));
  app.use("/graphql-docs", express.static(join(process.cwd(), "docs/graphql")));
  await app.listen(process.env.PORT ? parseInt(process.env.PORT, 10) : 3000);
}
bootstrap();
