import { Client } from "cassandra-driver";
import { loadEnv } from "../../config/env";
import { v7 as uuidv7 } from "uuid";
import * as bcrypt from "bcrypt";

async function getClient() {
  const env = loadEnv();
  const client = new Client({
    contactPoints: env.CASSANDRA_CONTACT_POINTS.split(",").map((s: string) =>
      s.trim()
    ),
    localDataCenter: env.CASSANDRA_LOCAL_DATACENTER,
    protocolOptions: { port: parseInt(env.CASSANDRA_PORT, 10) },
    keyspace: env.CASSANDRA_KEYSPACE,
  });
  await client.connect();
  return client;
}

export async function runSeed() {
  const env = loadEnv();
  const client = await getClient();
  try {
    const email = env.SUPER_ADMIN_EMAIL;
    const result = await client.execute(
      "SELECT email FROM users_by_email WHERE email = ?",
      [email],
      { prepare: true }
    );
    const exists = !!result.first();
    if (exists) {
      console.log("[seed] skipped: SUPER ADMIN already exists");
      await client.shutdown();
      return;
    }
    const id = uuidv7();
    const name = env.SUPER_ADMIN_NAME;
    const passwordHash = await bcrypt.hash(env.SUPER_ADMIN_PASSWORD, 10);
    const role = "ADMIN";
    const now = new Date();
    const birth = new Date("1999-01-01T00:00:00Z");
    const isActive = true;
    await client.execute(
      "INSERT INTO users_by_email (email, user_id, name, password_hash, birth_date, role, created_at, updated_at, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [email, id, name, passwordHash, birth, role, now, now, isActive],
      { prepare: true }
    );
    await client.execute(
      "INSERT INTO users_by_id (user_id, email, name, password_hash, birth_date, role, created_at, updated_at, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [id, email, name, passwordHash, birth, role, now, now, isActive],
      { prepare: true }
    );
    await client.execute(
      "INSERT INTO users_by_created_at (created_at, user_id, email, name, role, is_active) VALUES (?, ?, ?, ?, ?, ?)",
      [now, id, email, name, role, isActive],
      { prepare: true }
    );
    console.log("[seed] applied: SUPER ADMIN created");
    await client.shutdown();
  } catch (err) {
    console.error("[seed] aborted", err);
    await client.shutdown();
    process.exit(1);
  }
}

if (require.main === module) {
  runSeed();
}
