import { Inject } from '@nestjs/common';
import { ExampleRepository } from '../domain/example.repository';
import { ExampleEntity } from '../domain/example.entity';
import { CassandraClient, CASSANDRA_CLIENT } from '../../../common/database/cassandra.client';

export class ExampleRepositoryCassandra implements ExampleRepository {
  private readonly client: CassandraClient;
  private readonly memory: ExampleEntity[] = [];

  constructor(@Inject(CASSANDRA_CLIENT) client: CassandraClient) {
    this.client = client;
  }

  async create(name: string): Promise<ExampleEntity> {
    const now = new Date();
    const id = now.getTime().toString();
    const entity = new ExampleEntity({ id, name, createdAt: now });
    this.memory.push(entity);
    return entity;
  }

  async findAll(): Promise<ExampleEntity[]> {
    return [...this.memory];
  }
}
