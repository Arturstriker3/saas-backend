import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class CreateExampleInput {
  @Field()
  name!: string;
}
