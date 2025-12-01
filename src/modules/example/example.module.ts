import { Module } from "@nestjs/common";
import { ExampleResolver } from "./presentation/graphql/example.resolver";
import { cassandraClientProvider } from "../../common/database/cassandra.client";
import { ExampleRepository } from "./domain/example.repository";
import { ExampleRepositoryCassandra } from "./infrastructure/example.repository.cassandra";
import { CreateExampleUseCase } from "./application/use-cases/create-example.use-case";
import { ListExampleUseCase } from "./application/use-cases/list-example.use-case";
import { EXAMPLE_REPOSITORY } from "./tokens";

@Module({
  providers: [
    cassandraClientProvider,
    {
      provide: EXAMPLE_REPOSITORY,
      useClass: ExampleRepositoryCassandra,
    },
    {
      provide: CreateExampleUseCase,
      useFactory: (repo: ExampleRepository) => new CreateExampleUseCase(repo),
      inject: [EXAMPLE_REPOSITORY],
    },
    {
      provide: ListExampleUseCase,
      useFactory: (repo: ExampleRepository) => new ListExampleUseCase(repo),
      inject: [EXAMPLE_REPOSITORY],
    },
    ExampleResolver,
  ],
})
export class ExampleModule {}
