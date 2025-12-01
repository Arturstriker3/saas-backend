import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class CreateUserInput {
  @Field()
  tenantId!: string;

  @Field()
  name!: string;

  @Field()
  email!: string;

  @Field()
  passwordHash!: string;

  @Field()
  birthDate!: Date;
}

@InputType()
export class ActivateUserInput {
  @Field()
  id!: string;
}

@InputType()
export class ChangeUserNameInput {
  @Field()
  id!: string;

  @Field()
  name!: string;
}

@InputType()
export class ChangeUserPasswordInput {
  @Field()
  id!: string;

  @Field()
  newPasswordHash!: string;
}

@InputType()
export class DeactivateUserInput {
  @Field()
  id!: string;
}
