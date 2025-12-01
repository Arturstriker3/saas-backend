import { Module } from "@nestjs/common";
import { cassandraClientProvider } from "../../common/database/cassandra.client";
import { USER_REPOSITORY } from "./tokens";
import { UserRepository } from "./domain/user.repository";
import { UserRepositoryCassandra } from "./infrastructure/user.repository.cassandra";
import { CreateUserUseCase } from "./application/use-cases/create-user.use-case";
import { ListUsersUseCase } from "./application/use-cases/list-users.use-case";
import { ActivateUserUseCase } from "./application/use-cases/activate-user.use-case";
import { ChangeUserNameUseCase } from "./application/use-cases/change-user-name.use-case";
import { ChangeUserPasswordUseCase } from "./application/use-cases/change-user-password.use-case";
import { DeactivateUserUseCase } from "./application/use-cases/deactivate-user.use-case";
import { UserResolver } from "./presentation/graphql/user.resolver";

@Module({
  providers: [
    cassandraClientProvider,
    { provide: USER_REPOSITORY, useClass: UserRepositoryCassandra },
    {
      provide: CreateUserUseCase,
      useFactory: (repo: UserRepository) => new CreateUserUseCase(repo),
      inject: [USER_REPOSITORY],
    },
    {
      provide: ListUsersUseCase,
      useFactory: (repo: UserRepository) => new ListUsersUseCase(repo),
      inject: [USER_REPOSITORY],
    },
    {
      provide: ActivateUserUseCase,
      useFactory: (repo: UserRepository) => new ActivateUserUseCase(repo),
      inject: [USER_REPOSITORY],
    },
    {
      provide: ChangeUserNameUseCase,
      useFactory: (repo: UserRepository) => new ChangeUserNameUseCase(repo),
      inject: [USER_REPOSITORY],
    },
    {
      provide: ChangeUserPasswordUseCase,
      useFactory: (repo: UserRepository) => new ChangeUserPasswordUseCase(repo),
      inject: [USER_REPOSITORY],
    },
    {
      provide: DeactivateUserUseCase,
      useFactory: (repo: UserRepository) => new DeactivateUserUseCase(repo),
      inject: [USER_REPOSITORY],
    },
    UserResolver,
  ],
  exports: [USER_REPOSITORY],
})
export class UserModule {}
