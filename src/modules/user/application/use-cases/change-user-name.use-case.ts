import { z } from "zod";
import { UserRepository } from "../../domain/user.repository";
import { UserEntity } from "../../domain/user.entity";
import { USER_NAME_MIN_LENGTH } from "../../domain/user.constants";

export const ChangeUserNameDTO = z.object({
  id: z.string().min(1),
  name: z.string().min(USER_NAME_MIN_LENGTH),
});
export type ChangeUserNameInputDTO = z.infer<typeof ChangeUserNameDTO>;

export class ChangeUserNameUseCase {
  private readonly repo: UserRepository;

  constructor(repo: UserRepository) {
    this.repo = repo;
  }

  async execute(input: ChangeUserNameInputDTO): Promise<UserEntity> {
    const { id, name } = ChangeUserNameDTO.parse(input);
    const user = await this.repo.findById(id);
    if (!user) throw new Error("User not found");
    user.changeName(name);
    await this.repo.save(user);
    return user;
  }
}
