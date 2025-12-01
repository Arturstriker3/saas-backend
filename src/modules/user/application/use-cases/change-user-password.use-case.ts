import { z } from "zod";
import { UserRepository } from "../../domain/user.repository";
import { UserEntity } from "../../domain/user.entity";
import { USER_PASSWORD_HASH_MIN_LENGTH } from "../../domain/user.constants";

export const ChangeUserPasswordDTO = z.object({
  id: z.string().min(1),
  newPasswordHash: z.string().min(USER_PASSWORD_HASH_MIN_LENGTH),
});
export type ChangeUserPasswordInputDTO = z.infer<typeof ChangeUserPasswordDTO>;

export class ChangeUserPasswordUseCase {
  private readonly repo: UserRepository;

  constructor(repo: UserRepository) {
    this.repo = repo;
  }

  async execute(input: ChangeUserPasswordInputDTO): Promise<UserEntity> {
    const { id, newPasswordHash } = ChangeUserPasswordDTO.parse(input);
    const user = await this.repo.findById(id);
    if (!user) throw new Error("User not found");
    user.changePassword(newPasswordHash);
    await this.repo.save(user);
    return user;
  }
}
