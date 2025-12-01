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
  private readonly memory: Map<string, UserEntity> = new Map();

  constructor(@Inject(CASSANDRA_CLIENT) client: CassandraClient) {
    this.client = client;
  }

  async create(props: {
    tenantId: string;
    name: string;
    email: string;
    passwordHash: string;
    birthDate: Date;
  }): Promise<UserEntity> {
    const id = uuidv7();
    const now = new Date();
    const entity = new UserEntity({
      id,
      tenantId: props.tenantId,
      name: props.name,
      email: props.email,
      passwordHash: props.passwordHash,
      birthDate: props.birthDate,
      createdAt: now,
      updatedAt: now,
      isActive: false,
    });
    this.memory.set(entity.id, entity);
    return entity;
  }

  async findAll(): Promise<UserEntity[]> {
    return Array.from(this.memory.values());
  }

  async findById(id: string): Promise<UserEntity | null> {
    return this.memory.get(id) ?? null;
  }

  async save(user: UserEntity): Promise<void> {
    this.memory.set(user.id, user);
  }
}
