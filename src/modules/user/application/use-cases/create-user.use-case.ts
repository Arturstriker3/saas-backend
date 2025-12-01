import { z } from "zod";
import { UserRepository } from "../../domain/user.repository";
import { UserEntity } from "../../domain/user.entity";
import { USER_NAME_MIN_LENGTH, USER_PASSWORD_HASH_MIN_LENGTH } from "../../domain/user.constants";

export const CreateUserDTO = z.object({
  tenantId: z.string().min(1),
  name: z.string().min(USER_NAME_MIN_LENGTH),
  email: z.string().email(),
  passwordHash: z.string().min(USER_PASSWORD_HASH_MIN_LENGTH),
  birthDate: z.coerce.date(),
});

export type CreateUserInputDTO = z.infer<typeof CreateUserDTO>;

export class CreateUserUseCase {
  private readonly repo: UserRepository;

  constructor(repo: UserRepository) {
    this.repo = repo;
  }

  async execute(input: CreateUserInputDTO): Promise<UserEntity> {
    const parsed = CreateUserDTO.parse(input);
    return this.repo.create(parsed);
  }
}
