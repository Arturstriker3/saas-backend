import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { Inject } from "@nestjs/common";
import { LoginInput, RefreshTokenInput } from "./auth.inputs";
import { AuthPayload } from "./auth.types";
import { AuthenticateUserUseCase } from "../../application/use-cases/authenticate-user.use-case";
import { RefreshTokenUseCase } from "../../application/use-cases/refresh-token.use-case";
import { LogoutUseCase } from "../../application/use-cases/logout.use-case";
import { User } from "../../../user/presentation/graphql/user.types";
import { UserEntity } from "../../../user/domain/user.entity";

@Resolver()
export class AuthResolver {
  constructor(
    @Inject(AuthenticateUserUseCase)
    private readonly authUseCase: AuthenticateUserUseCase,
    @Inject(RefreshTokenUseCase)
    private readonly refreshUseCase: RefreshTokenUseCase,
    @Inject(LogoutUseCase) private readonly logoutUseCase: LogoutUseCase
  ) {}

  @Mutation(() => AuthPayload)
  async login(@Args("input") input: LoginInput): Promise<AuthPayload> {
    const { accessToken, refreshToken, user } =
      await this.authUseCase.execute(input);
    return { accessToken, refreshToken, user: this.toGraphQL(user) };
  }

  @Mutation(() => AuthPayload)
  async refreshToken(
    @Args("input") input: RefreshTokenInput
  ): Promise<AuthPayload> {
    const { accessToken, refreshToken, user } =
      await this.refreshUseCase.execute(input);
    return { accessToken, refreshToken, user: this.toGraphQL(user) };
  }

  @Mutation(() => Boolean)
  async logout(@Args("input") input: RefreshTokenInput): Promise<boolean> {
    return this.logoutUseCase.execute(input);
  }

  private toGraphQL(user: UserEntity): User {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      birthDate: user.birthDate,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      isActive: user.isActive,
      role: user.role,
    };
  }
}
