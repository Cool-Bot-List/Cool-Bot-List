import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
    imports: [
        GraphQLModule.forRoot({
            autoSchemaFile: "src/schema.gql",
        }),
        MongooseModule.forRoot(process.env.MONGO_URI),
    ],
})
export class AppModule { }