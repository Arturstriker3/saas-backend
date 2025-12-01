import { ObjectType, Field, GraphQLISODateTime } from "@nestjs/graphql";

@ObjectType()
export class Example {
  @Field()
  id!: string;

  @Field()
  name!: string;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;
}
