import { Module, Inject, OnModuleInit } from "@nestjs/common";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { loadEnv } from "../../common/config/env";
import {
  cassandraClientProvider,
  CASSANDRA_CLIENT,
  CassandraClient,
} from "../../common/database/cassandra.client";
import { UserModule } from "../user/user.module";
import { USER_REPOSITORY } from "../user/tokens";
import { UserRepository } from "../user/domain/user.repository";
import { RefreshTokenRepository } from "./domain/auth.repository";
import { RefreshTokenRepositoryCassandra } from "./infrastructure/refresh-token.repository.cassandra";
import { BcryptPasswordHasher } from "./infrastructure/password-hasher.bcrypt";
import { AuthenticateUserUseCase } from "./application/use-cases/authenticate-user.use-case";
import { RefreshTokenUseCase } from "./application/use-cases/refresh-token.use-case";
import { LogoutUseCase } from "./application/use-cases/logout.use-case";
import { AuthResolver } from "./presentation/graphql/auth.resolver";
import { JwtStrategy } from "./presentation/jwt.strategy";
import { GqlAuthGuard } from "./presentation/jwt.guard";

class RefreshTokensTableInit implements OnModuleInit {
  constructor(
    @Inject(CASSANDRA_CLIENT) private readonly client: CassandraClient
  ) {}
  async onModuleInit() {
    const env = loadEnv();
    if (env.SKIP_DB_CONNECT === "true") return;
    const ddl =
      "CREATE TABLE IF NOT EXISTS refresh_tokens (" +
      " token_value text PRIMARY KEY," +
      " user_id uuid," +
      " created_at timestamp," +
      " expires_at timestamp" +
      ")";
    await this.client.execute(ddl);
  }
}

@Module({
  imports: [
    UserModule,
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      useFactory: () => {
        const env = loadEnv();
        return { secret: env.JWT_SECRET };
      },
    }),
  ],
  providers: [
    cassandraClientProvider,
    {
      provide: RefreshTokenRepositoryCassandra,
      useClass: RefreshTokenRepositoryCassandra,
    },
    BcryptPasswordHasher,
    {
      provide: AuthenticateUserUseCase,
      useFactory: (
        users: UserRepository,
        hasher: BcryptPasswordHasher,
        tokens: RefreshTokenRepository,
        jwt: JwtService
      ) => new AuthenticateUserUseCase(users, hasher, tokens, jwt),
      inject: [
        USER_REPOSITORY,
        BcryptPasswordHasher,
        RefreshTokenRepositoryCassandra,
        JwtService,
      ],
    },
    {
      provide: RefreshTokenUseCase,
      useFactory: (
        tokens: RefreshTokenRepository,
        users: UserRepository,
        jwt: JwtService
      ) => new RefreshTokenUseCase(tokens, users, jwt),
      inject: [RefreshTokenRepositoryCassandra, USER_REPOSITORY, JwtService],
    },
    {
      provide: LogoutUseCase,
      useFactory: (tokens: RefreshTokenRepository) => new LogoutUseCase(tokens),
      inject: [RefreshTokenRepositoryCassandra],
    },
    AuthResolver,
    JwtStrategy,
    GqlAuthGuard,
    RefreshTokensTableInit,
  ],
  exports: [GqlAuthGuard, JwtStrategy],
})
export class AuthModule {}
