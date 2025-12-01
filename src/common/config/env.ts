import * as dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const EnvSchema = z.object({
  NODE_ENV: z.string().default('development'),
  PORT: z.string().optional(),
  CASSANDRA_CONTACT_POINTS: z.string().default('localhost'),
  CASSANDRA_PORT: z.string().default('9042'),
  CASSANDRA_LOCAL_DATACENTER: z.string().default('datacenter1'),
  CASSANDRA_KEYSPACE: z.string().default('app_keyspace'),
});

export type AppEnv = z.infer<typeof EnvSchema>;

let cachedEnv: AppEnv | null = null;

export function loadEnv(): AppEnv {
  if (cachedEnv) return cachedEnv;
  const parsed = EnvSchema.parse(process.env);
  cachedEnv = parsed;
  return parsed;
}
