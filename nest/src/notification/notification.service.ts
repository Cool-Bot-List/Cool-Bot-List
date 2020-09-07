import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
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
            user.notifications.push({ message: `Your bot, ${bot.tag}, was approved. 🤖`, read: false });
            this.events.emitNewNotification(user);
            return await user.save();
        }
    }

    public async handleBotReject(bot: Bot): Promise<User> {
        for (const id of bot.owners) {
            const user = await this.Users.findOne({ id });
            user.notifications.push({ message: `Your bot, ${bot.tag}, was rejected. 😢`, read: false });
            this.events.emitNewNotification(user);
            return await user.save();
        }
    }

    public async handleReviewCreation(bot: Bot, reviewer: User, rating: number): Promise<User | HttpException> {
        for (const owner of bot.owners) {
            const ownerObject = await this.Users.findOne({ id: owner });
            ownerObject.notifications.push({ message: `${reviewer.tag} just rated your bot ${rating} stars! ⭐`, read: false });
            this.events.emitNewNotification(ownerObject);
            try {
                return await ownerObject.save();
            } catch (err) {
                return new HttpException("Something went wrong and the owners were not notified of the reviews.", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    public async handleReviewLike(reviewOwner: User, liker: User): Promise<User | HttpException> {
        reviewOwner.notifications.push({ message: `${liker.tag} liked your review! 👍`, read: false });
        this.events.emitNewNotification(reviewOwner);
        return await reviewOwner.save();
    }

    public async handleReviewDislike(reviewOwner: User, disliker: User): Promise<User | HttpException> {
        reviewOwner.notifications.push({ message: `${disliker.tag} disliked your review 👎.`, read: false });
        this.events.emitNewNotification(reviewOwner);
        return await reviewOwner.save();
    }
}
