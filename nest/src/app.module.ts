import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { MongooseModule } from "@nestjs/mongoose";
import { BotModule } from "./bot/bot.module";
import { UserModule } from "./user/user.module";


@Module({
    imports: [
        GraphQLModule.forRoot({
            autoSchemaFile: "src/schema.gql",
        }),
        MongooseModule.forRoot(process.env.MONGO_URI),
        BotModule,
        UserModule,
    ],
})
export class AppModule { }