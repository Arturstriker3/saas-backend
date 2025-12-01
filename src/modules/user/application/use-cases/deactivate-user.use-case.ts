import { z } from 'zod';
import { UserRepository } from '../../domain/user.repository';
import { UserEntity } from '../../domain/user.entity';

export const DeactivateUserDTO = z.object({ id: z.string().min(1) });
export type DeactivateUserInputDTO = z.infer<typeof DeactivateUserDTO>;

export class DeactivateUserUseCase {
  private readonly repo: UserRepository;

  constructor(repo: UserRepository) {
    this.repo = repo;
  }

  async execute(input: DeactivateUserInputDTO): Promise<UserEntity> {
    const { id } = DeactivateUserDTO.parse(input);
    const user = await this.repo.findById(id);
    if (!user) throw new Error('User not found');
    user.deactivate();
    await this.repo.save(user);
    return user;
  }
}
