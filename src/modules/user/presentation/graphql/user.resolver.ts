import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { ListUsersUseCase } from '../../application/use-cases/list-users.use-case';
import { ActivateUserUseCase } from '../../application/use-cases/activate-user.use-case';
import { ChangeUserNameUseCase } from '../../application/use-cases/change-user-name.use-case';
import { ChangeUserPasswordUseCase } from '../../application/use-cases/change-user-password.use-case';
import { CreateUserInput, ActivateUserInput, ChangeUserNameInput, ChangeUserPasswordInput, DeactivateUserInput } from './user.inputs';
import { UserEntity } from '../../domain/user.entity';
import { User } from './user.types';
import { DeactivateUserUseCase } from '../../application/use-cases/deactivate-user.use-case';

@Resolver(() => User)
export class UserResolver {
  constructor(
    @Inject(CreateUserUseCase) private readonly createUseCase: CreateUserUseCase,
    @Inject(ListUsersUseCase) private readonly listUseCase: ListUsersUseCase,
    @Inject(ActivateUserUseCase) private readonly activateUseCase: ActivateUserUseCase,
    @Inject(ChangeUserNameUseCase) private readonly changeNameUseCase: ChangeUserNameUseCase,
    @Inject(ChangeUserPasswordUseCase) private readonly changePasswordUseCase: ChangeUserPasswordUseCase,
    @Inject(DeactivateUserUseCase) private readonly deactivateUseCase: DeactivateUserUseCase,
  ) {}

  @Query(() => [User])
  async users(): Promise<User[]> {
    const entities = await this.listUseCase.execute();
    return entities.map(this.toGraphQL);
  }

  @Mutation(() => User)
  async createUser(@Args('input') input: CreateUserInput): Promise<User> {
    const entity = await this.createUseCase.execute(input);
    return this.toGraphQL(entity);
  }

  @Mutation(() => User)
  async activateUser(@Args('input') input: ActivateUserInput): Promise<User> {
    const entity = await this.activateUseCase.execute(input);
    return this.toGraphQL(entity);
  }

  @Mutation(() => User)
  async changeUserName(@Args('input') input: ChangeUserNameInput): Promise<User> {
    const entity = await this.changeNameUseCase.execute(input);
    return this.toGraphQL(entity);
  }

  @Mutation(() => User)
  async changeUserPassword(@Args('input') input: ChangeUserPasswordInput): Promise<User> {
    const entity = await this.changePasswordUseCase.execute(input);
    return this.toGraphQL(entity);
  }

  @Mutation(() => User)
  async deactivateUser(@Args('input') input: DeactivateUserInput): Promise<User> {
    const entity = await this.deactivateUseCase.execute(input);
    return this.toGraphQL(entity);
  }

  private toGraphQL(entity: UserEntity): User {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      birthDate: entity.birthDate,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      isActive: entity.isActive,
      role: entity.role,
    };
  }
}
