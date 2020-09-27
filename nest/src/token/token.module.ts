import { Module } from "@nestjs/common";
import { TokenService } from "./token.service";
import { TokenResolver } from "./token.resolver";
import { User, UserSchema } from "src/user/user.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { EventsModule } from "src/events/events.module";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
        ]),
        EventsModule,
    ],
    providers: [TokenService, TokenResolver],
})
export class TokenModule { }
