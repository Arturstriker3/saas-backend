import { Inject } from "@nestjs/common";
import {
  CassandraClient,
  CASSANDRA_CLIENT,
} from "../../../common/database/cassandra.client";
import {
  RefreshTokenRecord,
  RefreshTokenRepository,
} from "../domain/auth.repository";

export class RefreshTokenRepositoryCassandra implements RefreshTokenRepository {
  private readonly client: CassandraClient;

  constructor(@Inject(CASSANDRA_CLIENT) client: CassandraClient) {
    this.client = client;
  }

  async save(record: RefreshTokenRecord): Promise<void> {
    const query =
      "INSERT INTO refresh_tokens (token_value, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)";
    const params = [
      record.token,
      record.userId,
      record.createdAt,
      record.expiresAt,
    ];
    await this.client.execute(query, params, { prepare: true });
  }

  async findByToken(token: string): Promise<RefreshTokenRecord | null> {
    const query =
      "SELECT token_value, user_id, created_at, expires_at FROM refresh_tokens WHERE token_value = ?";
    const result = await this.client.execute(query, [token], { prepare: true });
    const row = result.first();
    if (!row) return null;
    return {
      token: row.get("token_value"),
      userId: row.get("user_id"),
      createdAt: row.get("created_at"),
      expiresAt: row.get("expires_at"),
    };
  }

  async deleteByToken(token: string): Promise<void> {
    const query = "DELETE FROM refresh_tokens WHERE token_value = ?";
    await this.client.execute(query, [token], { prepare: true });
  }
}
