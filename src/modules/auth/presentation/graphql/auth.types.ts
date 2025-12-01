import { ObjectType, Field } from "@nestjs/graphql";
import { User } from "../../../user/presentation/graphql/user.types";

@ObjectType()
export class AuthPayload {
  @Field()
  accessToken!: string;

  @Field()
  refreshToken!: string;

  @Field(() => User)
  user!: User;
}
