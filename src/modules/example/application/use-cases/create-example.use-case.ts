import { z } from 'zod';
import { ExampleRepository } from '../../domain/example.repository';
import { ExampleEntity } from '../../domain/example.entity';

export const CreateExampleDTO = z.object({
  name: z.string().min(1),
});

export type CreateExampleInputDTO = z.infer<typeof CreateExampleDTO>;

export class CreateExampleUseCase {
  private readonly repo: ExampleRepository;

  constructor(repo: ExampleRepository) {
    this.repo = repo;
  }

  async execute(input: CreateExampleInputDTO): Promise<ExampleEntity> {
    const parsed = CreateExampleDTO.parse(input);
    return this.repo.create(parsed.name);
  }
}
