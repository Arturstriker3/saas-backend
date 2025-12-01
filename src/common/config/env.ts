import * as dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const EnvSchema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.string().default("3000"),
  DOCS_ROUTE: z.string().default("/graphql-docs"),
  DOCS_PORT: z.string().default("3333"),
  SKIP_DB_CONNECT: z.string().default("false"),
  CASSANDRA_CONTACT_POINTS: z.string().default("localhost"),
  CASSANDRA_PORT: z.string().default("9042"),
  CASSANDRA_LOCAL_DATACENTER: z.string().default("datacenter1"),
  CASSANDRA_KEYSPACE: z.string().default("app_keyspace"),
  JWT_SECRET: z.string().default("changeme"),
  JWT_EXPIRES_IN: z.string().default("900s"),
  REFRESH_TOKEN_TTL: z.string().default("1209600"),
  RUN_MIGRATIONS_ON_STARTUP: z.string().default("false"),
  RUN_SEED_ON_STARTUP: z.string().default("false"),
  SUPER_ADMIN_EMAIL: z.string().default("admin@example.com"),
  SUPER_ADMIN_NAME: z.string().default("Super Admin"),
  SUPER_ADMIN_PASSWORD: z.string().default("admin123"),
});

export type AppEnv = z.infer<typeof EnvSchema>;

let cachedEnv: AppEnv | null = null;

export function loadEnv(): AppEnv {
  if (cachedEnv) return cachedEnv;
  const parsed = EnvSchema.parse(process.env);
  cachedEnv = parsed;
  return parsed;
}
