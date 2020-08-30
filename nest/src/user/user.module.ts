import { Module } from "@nestjs/common";
import { VoteModule } from "src/vote/vote.module";
import { NotificationModule } from "src/notification/notification.module";
import { UserResolver } from "./user.resolver";
import { UserService } from "./user.service";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./user.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
        ]),
        VoteModule,
        NotificationModule,
    ],
    providers: [UserResolver, UserService],
})
export class UserModule { }
