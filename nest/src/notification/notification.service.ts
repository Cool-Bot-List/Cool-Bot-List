/* eslint-disable indent */
import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "src/user/user.schema";
import { Model } from "mongoose";
import { Bot } from "src/bot/bot.schema";
import { EventsGateway } from "src/events/events.gateway";
import { NotificationUpdateMethods } from "./constants/notification-update-methods.enum";
import { NotificationType } from "./gql-types/notification.type";

@Injectable()
export class NotificationService {
    constructor(
        @InjectModel(User.name)
        private Users: Model<User>,
        private events: EventsGateway
    ) { }

    public async update(
        userId: string,
        notificationQuery: string,
        method: string
    ): Promise<NotificationType | HttpException> {

        const user = await this.Users.findOne({ id: userId });
        if (!user) return new HttpException("User not found.", HttpStatus.NOT_FOUND);

        const foundIndex = user.notifications.findIndex(n => n.message === notificationQuery);
        const notiIndex = foundIndex === -1 ? parseInt(notificationQuery) : foundIndex;

        if (!notiIndex) return new HttpException("A notification was not found.", HttpStatus.NOT_FOUND);

        switch (method) {
            case NotificationUpdateMethods.READ:
                user.notifications[notiIndex].read = true;
                break;
            case NotificationUpdateMethods.UNREAD:
                user.notifications[notiIndex].read = false;
                break;
        }

        await user.save();
        this.events.emitNotificationUpdate(user);
        return user.notifications[notiIndex];
    }

    public async updateAll(userId: string, method: string): Promise<NotificationType[] | HttpException> {
        const user = await this.Users.findOne({ id: userId });
        if (!user) return new HttpException("User not found.", HttpStatus.NOT_FOUND);

        switch (method) {
            case NotificationUpdateMethods.READ:
                for (const n of user.notifications) n.read = true;
                break;
            case NotificationUpdateMethods.UNREAD:
                for (const n of user.notifications) n.read = false;
        }

        await user.save();
        this.events.emitNotificationUpdate(user);
        return user.notifications;
    }

    private async rmDuplicates(user: User): Promise<User> {
        user.notifications = user.notifications.filter((e, i, a) => a.findIndex(t => (t.message === e.message)) === i);
        return await user.save();
    }

    public async handleBotApprove(bot: Bot): Promise<User> {
        for (const id of bot.owners) {
            const user = await this.Users.findOne({ id });
            user.notifications.push({ message: `Your bot, ${bot.tag}, was approved. 🤖`, read: false });
            const u = await this.rmDuplicates(user);
            this.events.emitNewNotification(u);
            return u;
        }
    }

    public async handleBotReject(bot: Bot): Promise<User> {
        for (const id of bot.owners) {
            const user = await this.Users.findOne({ id });
            user.notifications.push({ message: `Your bot, ${bot.tag}, was rejected. 😢`, read: false });
            const u = await this.rmDuplicates(user);
            this.events.emitNewNotification(u);
            return u;
        }
    }

    public async handleReviewCreation(bot: Bot, reviewer: User, rating: number): Promise<User | HttpException> {
        for (const owner of bot.owners) {
            const ownerObject = await this.Users.findOne({ id: owner });
            ownerObject.notifications.push({ message: `${reviewer.tag} just rated your bot ${rating} stars! ⭐`, read: false });

            try {
                const u = await this.rmDuplicates(ownerObject);
                this.events.emitNewNotification(u);
                return u;
            } catch (err) {
                return new HttpException("Something went wrong and the owners were not notified of the reviews.", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    public async handleReviewLike(reviewOwner: User, liker: User): Promise<User> {
        reviewOwner.notifications.push({ message: `${liker.tag} liked your review! 👍`, read: false });
        const u = await this.rmDuplicates(reviewOwner);
        this.events.emitNewNotification(u);
        return u;
    }

    public async handleReviewDislike(reviewOwner: User, disliker: User): Promise<User> {
        reviewOwner.notifications.push({ message: `${disliker.tag} disliked your review 👎.`, read: false });
        const u = await this.rmDuplicates(reviewOwner);
        this.events.emitNewNotification(u);
        return u;
    }

    public async handleOwnerReplyCreation(reviewOwner: User, botOwner: User): Promise<User> {
        reviewOwner.notifications.push({ message: `${botOwner.tag} has replied to your review!`, read: false });
        const u = await this.rmDuplicates(reviewOwner);
        this.events.emitNewNotification(u);
        return u;
    }

    public async handleOwnerReplyLike(owner: User, liker: User): Promise<User> {
        owner.notifications.push({ message: `${liker.tag} liked your reply! 👍`, read: false });
        const u = await this.rmDuplicates(owner);
        this.events.emitNewNotification(u);
        return u;
    }

    public async handleOwnerReplyDislike(owner: User, disliker: User): Promise<User> {
        owner.notifications.push({ message: `${disliker.tag} disliked your reply! 👎`, read: false });
        const u = await this.rmDuplicates(owner);
        this.events.emitNewNotification(u);
        return u;
    }
}
