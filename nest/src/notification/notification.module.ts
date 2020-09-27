import { Module } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { NotificationResolver } from "./notification.resolver";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "src/user/user.schema";
import { EventsModule } from "src/events/events.module";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
        ]),
        EventsModule,
    ],
    exports: [NotificationService],
    providers: [NotificationService, NotificationResolver],
})
export class NotificationModule { }
