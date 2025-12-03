import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class LoginInput {
  @Field()
  email!: string;

  @Field()
  password!: string;
}

@InputType()
export class RefreshTokenInput {
  @Field()
  refreshToken!: string;
}

@InputType()
export class RequestPasswordResetInput {
  @Field()
  email!: string;
}

@InputType()
export class ConfirmPasswordResetInput {
  @Field()
  token!: string;
  @Field()
  newPassword!: string;
}
