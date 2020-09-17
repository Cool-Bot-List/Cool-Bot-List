import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { MongooseModule } from "@nestjs/mongoose";
import { BotModule } from "./bot/bot.module";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { Request, Response } from "express";
import { PublicApiModule } from "./public-api/public-api.module";


@Module({
    imports: [
        GraphQLModule.forRoot({
            autoSchemaFile: "src/schema.gql",
            path: "/api/graphql",
            context: ({ req, res }: { req: Request, res: Response }) => ({ req, res }),
            playground: {
                settings: {
                    "request.credentials": "include",
                },
            },
        }),
        MongooseModule.forRoot(process.env.MONGO_URI),
        AuthModule,
        BotModule,
        UserModule,
        PublicApiModule,
    ],
})
export class AppModule { }