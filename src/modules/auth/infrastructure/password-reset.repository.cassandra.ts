import { Inject } from "@nestjs/common";
import { types } from "cassandra-driver";
import {
  CassandraClient,
  CASSANDRA_CLIENT,
} from "../../../common/database/cassandra.client";
import {
  PasswordResetRecord,
  PasswordResetRepository,
} from "../domain/password-reset.repository";

export class PasswordResetRepositoryCassandra implements PasswordResetRepository {
  private readonly client: CassandraClient;

  constructor(@Inject(CASSANDRA_CLIENT) client: CassandraClient) {
    this.client = client;
  }

  async save(record: PasswordResetRecord): Promise<void> {
    const query =
      "INSERT INTO password_resets (token_value, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)";
    const params = [
      record.token,
      types.Uuid.fromString(record.userId),
      record.createdAt,
      record.expiresAt,
    ];
    await this.client.execute(query, params, { prepare: true });
  }

  async findByToken(token: string): Promise<PasswordResetRecord | null> {
    const query =
      "SELECT token_value, user_id, created_at, expires_at FROM password_resets WHERE token_value = ?";
    const result = await this.client.execute(query, [token], { prepare: true });
    const row = result.first();
    if (!row) return null;
    return {
      token: row.get("token_value"),
      userId: row.get("user_id").toString(),
      createdAt: row.get("created_at"),
      expiresAt: row.get("expires_at"),
    };
  }

  async deleteByToken(token: string): Promise<void> {
    const query = "DELETE FROM password_resets WHERE token_value = ?";
    await this.client.execute(query, [token], { prepare: true });
  }
}
