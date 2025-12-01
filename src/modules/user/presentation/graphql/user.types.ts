import { ObjectType, Field, GraphQLISODateTime } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field()
  id!: string;

  @Field()
  tenantId!: string;

  @Field()
  name!: string;

  @Field()
  email!: string;

  @Field(() => GraphQLISODateTime)
  birthDate!: Date;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date;

  @Field()
  isActive!: boolean;
}
