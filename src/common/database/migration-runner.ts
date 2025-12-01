import { Client } from "cassandra-driver";
import { loadEnv } from "../config/env";
import { promises as fs } from "fs";
import { join } from "path";

type Migration = { version: string; filepath: string; content: string };

async function readMigrations(dir: string): Promise<Migration[]> {
  const files = await fs.readdir(dir);
  const cqls = files.filter((f) => f.toLowerCase().endsWith(".cql"));
  cqls.sort();
  const list: Migration[] = [];
  for (const f of cqls) {
    const fp = join(dir, f);
    const raw = await fs.readFile(fp, "utf8");
    list.push({
      version: f.replace(/\.cql$/i, ""),
      filepath: fp,
      content: raw,
    });
  }
  return list;
}

async function ensureKeyspace(env: ReturnType<typeof loadEnv>) {
  const client = new Client({
    contactPoints: env.CASSANDRA_CONTACT_POINTS.split(",").map((s) => s.trim()),
    localDataCenter: env.CASSANDRA_LOCAL_DATACENTER,
    protocolOptions: { port: parseInt(env.CASSANDRA_PORT, 10) },
  });
  await client.connect();
  const cql = `CREATE KEYSPACE IF NOT EXISTS ${env.CASSANDRA_KEYSPACE} WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1}`;
  await client.execute(cql);
  await client.shutdown();
}

async function getKeyspaceClient(env: ReturnType<typeof loadEnv>) {
  const client = new Client({
    contactPoints: env.CASSANDRA_CONTACT_POINTS.split(",").map((s) => s.trim()),
    localDataCenter: env.CASSANDRA_LOCAL_DATACENTER,
    protocolOptions: { port: parseInt(env.CASSANDRA_PORT, 10) },
    keyspace: env.CASSANDRA_KEYSPACE,
  });
  await client.connect();
  return client;
}

async function ensureMigrationsTable(client: Client) {
  const ddl =
    "CREATE TABLE IF NOT EXISTS schema_migrations (version TEXT PRIMARY KEY, applied_at TIMESTAMP)";
  await client.execute(ddl);
}

async function getAppliedVersions(client: Client): Promise<Set<string>> {
  const res = await client.execute("SELECT version FROM schema_migrations");
  const set = new Set<string>();
  for (const row of res.rows) {
    set.add(row.get("version"));
  }
  return set;
}

function substitute(content: string, env: ReturnType<typeof loadEnv>) {
  return content.replace(/\$\{KEYSPACE\}/g, env.CASSANDRA_KEYSPACE);
}

export async function runMigrations() {
  const env = loadEnv();
  const dir = join(process.cwd(), "src", "common", "database", "migrations");
  const migrations = await readMigrations(dir);
  try {
    await ensureKeyspace(env);
    const client = await getKeyspaceClient(env);
    await ensureMigrationsTable(client);
    const applied = await getAppliedVersions(client);
    for (const m of migrations) {
      const version = m.version;
      if (applied.has(version)) {
        console.log(`[migration] skipped ${version}`);
        continue;
      }
      const cql = substitute(m.content, env);
      const statements = cql
        .split(/;\s*(?:\r?\n|$)/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      try {
        for (const stmt of statements) {
          await client.execute(stmt);
        }
        await client.execute(
          "INSERT INTO schema_migrations (version, applied_at) VALUES (?, ?)",
          [version, new Date()],
          { prepare: true }
        );
        console.log(`[migration] applied ${version}`);
      } catch (err) {
        console.error(`[migration] error on ${version}:`, err);
        await client.shutdown();
        throw err;
      }
    }
    await client.shutdown();
  } catch (err) {
    console.error("[migration] aborted", err);
    process.exit(1);
  }
}

if (require.main === module) {
  runMigrations();
}
