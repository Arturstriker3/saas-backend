import { ExampleRepository } from '../../domain/example.repository';
import { ExampleEntity } from '../../domain/example.entity';

export class ListExampleUseCase {
  private readonly repo: ExampleRepository;

  constructor(repo: ExampleRepository) {
    this.repo = repo;
  }

  async execute(): Promise<ExampleEntity[]> {
    return this.repo.findAll();
  }
}
