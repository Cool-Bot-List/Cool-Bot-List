import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "src/user/user.schema";
import { Model } from "mongoose";
import { Bot } from "src/bot/bot.schema";
import { EventsGateway } from "src/events/events.gateway";

@Injectable()
export class NotificationService {
    constructor(
        @InjectModel(User.name)
        private Users: Model<User>,
        private events: EventsGateway
    ) { }

    public async handleBotApprove(bot: Bot): Promise<User> {
        for (const id of bot.owners) {
            const user = await this.Users.findOne({ id });
            user.notifications.push({ message: `Your bot ${bot.tag} was approved 🤖.`, read: false });
            this.events.emitNewNotification(user);
            return await user.save();
        }
    }

    public async handleBotReject(bot: Bot): Promise<User> {
        for (const id of bot.owners) {
            const user = await this.Users.findOne({ id });
            user.notifications.push({ message: `Your bot ${bot.tag} was rejected 😢.`, read: false });
            this.events.emitNewNotification(user);
            return await user.save();
        }
    }
}
