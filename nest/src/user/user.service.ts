/* eslint-disable indent */
import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { User } from "./user.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Bot } from "src/bot/bot.schema";
import { Vote } from "src/vote/interfaces/vote.interface";
import { UserUpdatable } from "./gql-types/user-updatable.type";
import { EventsGateway } from "src/events/events.gateway";
import { BotService } from "src/bot/bot.service";
import { Review } from "src/review/review.schema";
import { ReviewService } from "src/review/review.service";
import { OwnerReplyService } from "src/owner-reply/owner-reply.service";
import { AdminMethodResolvable, AdminMethods } from "./constants/admin-methods.enum";

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name)
        private Users: Model<User>,
        @InjectModel(Bot.name)
        private Bots: Model<Bot>,
        @InjectModel(Review.name)
        private Reviews: Model<Review>,
        private events: EventsGateway,
        private botService: BotService,
        private reviewService: ReviewService,
        private ownerReplyService: OwnerReplyService
    ) { }

    public async getAll(): Promise<User[]> {
        return this.Users.find();
    }

    public async get(id: string): Promise<User> {
        return this.Users.findOne({ id });
    }

    public async getAdmins(): Promise<User[]> {
        return this.Users.find({ isAdmin: true });
    }

    public getMe(user: User): User | HttpException {
        return user || new HttpException("A user is not logged in.", HttpStatus.NOT_FOUND);
    }

    public async getBots(user: User): Promise<Bot[]> {
        const bots: Bot[] = [];
        for (const id of user.bots) {
            bots.push(await this.Bots.findOne({ id }));
        }
        return bots;
    }

    public async getBot(user: User, id: string): Promise<Bot | HttpException> {
        if (!user.bots.includes(id)) return new HttpException("Doesn't exist on the user's bots.", HttpStatus.NOT_FOUND);
        return await this.Bots.findOne({ id });
    }

    public async getVote(user: User): Promise<Vote> {
        if (user.vote.bot === null || user.vote.date === null) return null;
        return user.vote;
    }

    public async update(data: UserUpdatable): Promise<User | HttpException> {
        let foundUser: User;
        try {
            foundUser = await this.Users.findOneAndUpdate({ id: data.id }, data, { new: true });
        } catch (err) {
            return new HttpException("User not found.", HttpStatus.NOT_FOUND);
        }
        this.events.emitUserUpdate(foundUser);
        return foundUser;
    }

    public async delete(id: string): Promise<User | HttpException> {
        const user = await this.Users.findOne({ id });
        if (!user) return new HttpException("User not found.", HttpStatus.NOT_FOUND);

        // Handle the bots of the deleted user.
        for (const botId of user.bots) {
            const bot = await this.Bots.findOne({ id: botId });

            // If the only owner of the bot is the deleted user then delete the bot.
            if (bot.owners.includes(user.id) && bot.owners.length === 1)
                await this.botService.delete(botId, user);

            // Remove the deleted user from the owners array.
            bot.owners.splice(bot.owners.findIndex(oId => oId === user.id), 1);
        }

        // Delete all of the deleted user's reviews.
        const userMadeReviews = (await this.Reviews.find()).filter(r => r.userId === user.id);
        for (const r of userMadeReviews) this.reviewService.delete(r._id);

        // Delete all of the deleted user's owner replies.
        const userMadeOwnerRepliesReviews = (await this.Reviews.find()).filter(r => r.ownerReply.userId === user.id);
        for (const r of userMadeOwnerRepliesReviews) this.ownerReplyService.delete(r._id);

        this.events.emitUserDelete(user);
        return await user.deleteOne();
    }

    public async makeAdmin(id: string, method: AdminMethodResolvable): Promise<User | HttpException> {
        const user = await this.Users.findOne({ id });
        if (!user) return new HttpException("User not found.", HttpStatus.NOT_FOUND);

        switch (method) {
            case AdminMethods.ADD:
                user.isAdmin = true;
                break;
            case AdminMethods.REMOVE:
                user.isAdmin = false;
                break;
        }

        this.events.emitUserUpdate(user);
        return await user.save();
    }
}
