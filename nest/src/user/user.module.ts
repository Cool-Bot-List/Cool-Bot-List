import { Module } from "@nestjs/common";
import { VoteModule } from "src/vote/vote.module";
import { NotificationModule } from "src/notification/notification.module";

@Module({
    imports: [VoteModule, NotificationModule],
})
export class UserModule { }
