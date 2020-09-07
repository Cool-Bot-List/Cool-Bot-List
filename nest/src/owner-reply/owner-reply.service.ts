import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Review } from "src/review/review.schema";
import { User } from "src/user/user.schema";
import { OwnerReply } from "./interfaces/ownerReply.interface";
import { OwnerReplyCreatable } from "./gql-types/owner-reply-creatable.input";
import { Bot } from "src/bot/bot.schema";
import { EventsGateway } from "src/events/events.gateway";
import { NotificationService } from "src/notification/notification.service";


@Injectable()
export class OwnerReplyService {
    constructor(
        @InjectModel(Review.name)
        private Reviews: Model<Review>,
        @InjectModel(User.name)
        private Users: Model<User>,
        @InjectModel(Bot.name)
        private Bots: Model<Bot>,
        private events: EventsGateway,
        private notificationService: NotificationService
    ) { }

    public async getUser(ownerReply: OwnerReply): Promise<User> {
        return this.Users.findOne({ id: ownerReply.userId });
    }

    public async getUsersThatLiked(ownerReply: OwnerReply): Promise<User[]> {
        const users: User[] = [];
        for (const id of ownerReply.likes) {
            users.push(await this.Users.findOne({ id }));
        }
        return users;
    }

    public async getUsersThatDisliked(ownerReply: OwnerReply): Promise<User[]> {
        const users: User[] = [];
        for (const id of ownerReply.dislikes) {
            users.push(await this.Users.findOne({ id }));
        }
        return users;
    }

    public async create(data: OwnerReplyCreatable): Promise<OwnerReply | HttpException> {
        const { ownerId, reviewId, review } = data;
        const foundReview = await this.Reviews.findById(reviewId);
        if (!foundReview) return new HttpException("Review doesn't exist", HttpStatus.NOT_FOUND);

        const foundBot = await this.Bots.findOne({ id: foundReview.botId });

        // Check to make sure it's one of the owners making the request
        if (!foundBot.owners.includes(ownerId))
            return new HttpException("You don't have permission to perform that action.", HttpStatus.UNAUTHORIZED);

        // Check to see if the user exists
        const foundOwner = await this.Users.findOne({ id: ownerId });
        if (!foundOwner) return new HttpException("The owner doesn't exist in the database!", HttpStatus.NOT_FOUND);

        // Push notification to user.
        const userToPushTo = await this.Users.findOne({ id: foundReview.userId });
        await this.notificationService.handleOwnerReplyCreation(userToPushTo, foundOwner);

        // Insert the reply, userId and date.
        foundReview.ownerReply.review = review;
        foundReview.ownerReply.userId = foundOwner.id;
        foundReview.ownerReply.date = new Date();

        try {
            // Save it
            await userToPushTo.save();
            await foundReview.save();
        } catch (err) {
            new HttpException("Something went wrong and the reply did not post.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        this.events.emitNewOwnerReply(foundReview, foundOwner, userToPushTo);
        return foundReview.ownerReply;
    }


}
