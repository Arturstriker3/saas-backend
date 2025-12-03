import { Inject } from "@nestjs/common";
import {
  CassandraClient,
  CASSANDRA_CLIENT,
} from "../../../common/database/cassandra.client";
import { UserRepository } from "../domain/user.repository";
import { UserEntity } from "../domain/user.entity";
import { v7 as uuidv7 } from "uuid";

export class UserRepositoryCassandra implements UserRepository {
  private readonly client: CassandraClient;

  constructor(@Inject(CASSANDRA_CLIENT) client: CassandraClient) {
    this.client = client;
  }

  async create(props: {
    name: string;
    email: string;
    passwordHash: string;
    birthDate: Date;
    role: string;
  }): Promise<UserEntity> {
    const id = uuidv7();
    const now = new Date();
    const isActive = false;
    await this.client.execute(
      "INSERT INTO users_by_email (email, user_id, name, password_hash, birth_date, role, created_at, updated_at, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        props.email.toLowerCase(),
        id,
        props.name,
        props.passwordHash,
        props.birthDate,
        props.role,
        now,
        now,
        isActive,
      ],
      { prepare: true }
    );
    await this.client.execute(
      "INSERT INTO users_by_id (user_id, email, name, password_hash, birth_date, role, created_at, updated_at, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        id,
        props.email.toLowerCase(),
        props.name,
        props.passwordHash,
        props.birthDate,
        props.role,
        now,
        now,
        isActive,
      ],
      { prepare: true }
    );
    await this.client.execute(
      "INSERT INTO users_by_created_at (created_at, user_id, email, name, role, is_active) VALUES (?, ?, ?, ?, ?, ?)",
      [now, id, props.email.toLowerCase(), props.name, props.role, isActive],
      { prepare: true }
    );
    return new UserEntity({
      id,
      name: props.name,
      email: props.email.toLowerCase(),
      passwordHash: props.passwordHash,
      birthDate: props.birthDate,
      role: props.role,
      createdAt: now,
      updatedAt: now,
      isActive,
    });
  }

  async findAll(): Promise<UserEntity[]> {
    const res = await this.client.execute(
      "SELECT user_id, email, name, password_hash, birth_date, role, created_at, updated_at, is_active FROM users_by_id"
    );
    return res.rows.map(
      (row) =>
        new UserEntity({
          id: row.get("user_id").toString(),
          email: row.get("email"),
          name: row.get("name"),
          passwordHash: row.get("password_hash"),
          birthDate: row.get("birth_date"),
          role: row.get("role"),
          createdAt: row.get("created_at"),
          updatedAt: row.get("updated_at"),
          isActive: row.get("is_active"),
        })
    );
  }

  async findById(id: string): Promise<UserEntity | null> {
    const res = await this.client.execute(
      "SELECT user_id, email, name, password_hash, birth_date, role, created_at, updated_at, is_active FROM users_by_id WHERE user_id = ?",
      [id],
      { prepare: true }
    );
    const row = res.first();
    if (!row) return null;
    return new UserEntity({
      id: row.get("user_id").toString(),
      email: row.get("email"),
      name: row.get("name"),
      passwordHash: row.get("password_hash"),
      birthDate: row.get("birth_date"),
      role: row.get("role"),
      createdAt: row.get("created_at"),
      updatedAt: row.get("updated_at"),
      isActive: row.get("is_active"),
    });
  }

  async save(user: UserEntity): Promise<void> {
    const now = new Date();
    await this.client.execute(
      "UPDATE users_by_id SET email = ?, name = ?, password_hash = ?, birth_date = ?, role = ?, updated_at = ?, is_active = ? WHERE user_id = ?",
      [
        user.email,
        user.name,
        user.passwordHash,
        user.birthDate,
        user.role,
        now,
        user.isActive,
        user.id,
      ],
      { prepare: true }
    );
    await this.client.execute(
      "UPDATE users_by_email SET user_id = ?, name = ?, password_hash = ?, birth_date = ?, role = ?, updated_at = ?, is_active = ? WHERE email = ?",
      [
        user.id,
        user.name,
        user.passwordHash,
        user.birthDate,
        user.role,
        now,
        user.isActive,
        user.email,
      ],
      { prepare: true }
    );
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const res = await this.client.execute(
      "SELECT email, user_id, name, password_hash, birth_date, role, created_at, updated_at, is_active FROM users_by_email WHERE email = ?",
      [email.toLowerCase()],
      { prepare: true }
    );
    const row = res.first();
    if (!row) return null;
    return new UserEntity({
      id: row.get("user_id").toString(),
      email: row.get("email"),
      name: row.get("name"),
      passwordHash: row.get("password_hash"),
      birthDate: row.get("birth_date"),
      role: row.get("role"),
      createdAt: row.get("created_at"),
      updatedAt: row.get("updated_at"),
      isActive: row.get("is_active"),
    });
  }
}
