import { ExampleEntity } from './example.entity';

export interface ExampleRepository {
  create(name: string): Promise<ExampleEntity>;
  findAll(): Promise<ExampleEntity[]>;
}
