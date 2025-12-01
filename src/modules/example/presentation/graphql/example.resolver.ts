import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { ObjectType, Field } from "@nestjs/graphql";
import { Inject } from "@nestjs/common";
import { CreateExampleUseCase } from "../../application/use-cases/create-example.use-case";
import { ListExampleUseCase } from "../../application/use-cases/list-example.use-case";
import { CreateExampleInput } from "./example.inputs";
import { ExampleEntity } from "../../domain/example.entity";

@ObjectType()
class Example {
  @Field()
  id!: string;

  @Field()
  name!: string;

  @Field()
  createdAt!: Date;
}

@Resolver(() => Example)
export class ExampleResolver {
  constructor(
    @Inject(CreateExampleUseCase)
    private readonly createUseCase: CreateExampleUseCase,
    @Inject(ListExampleUseCase)
    private readonly listUseCase: ListExampleUseCase
  ) {}

  @Query(() => [Example])
  async examples(): Promise<Example[]> {
    const entities = await this.listUseCase.execute();
    return entities.map(this.toGraphQL);
  }

  @Mutation(() => Example)
  async createExample(
    @Args("input") input: CreateExampleInput
  ): Promise<Example> {
    const entity = await this.createUseCase.execute(input);
    return this.toGraphQL(entity);
  }

  private toGraphQL(entity: ExampleEntity): Example {
    return {
      id: entity.id,
      name: entity.name,
      createdAt: entity.createdAt,
    };
  }
}
