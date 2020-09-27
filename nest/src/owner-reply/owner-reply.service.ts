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
        if (foundReview.ownerReply.review.length > 0) return new HttpException("Owner Reply already exists.", HttpStatus.BAD_REQUEST);

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

    public async update(reviewId: string, newReview: string): Promise<OwnerReply | HttpException> {
        const review = await this.Reviews.findById(reviewId);
        if (!review) return new HttpException("A review was not found.", HttpStatus.NOT_FOUND);

        review.ownerReply.review = newReview;
        review.ownerReply.edited = new Date();
        this.events.emitOwnerReplyUpdate(review, (await this.Users.findOne({ id: review.ownerReply.userId })));
        return await review.save();
    }

    public async like(reviewId: string, userId: string): Promise<OwnerReply | HttpException> {
        const foundReview = await this.Reviews.findById(reviewId);
        const foundUser = await this.Users.findOne({ id: userId });
        if (!foundReview || !foundUser) return new HttpException("A user or a review does not exist", HttpStatus.NOT_FOUND);

        const userToPushTo = await this.Users.findOne({ id: foundReview.ownerReply.userId });
        let like = null;
        if (!foundReview.ownerReply.likes.includes(foundUser.id)) {
            foundReview.ownerReply.likes.push(foundUser.id);
            // Remove the dislike of the user if dislike

            if (foundReview.ownerReply.dislikes.includes(foundUser.id)) {
                foundReview.ownerReply.dislikes.splice(
                    foundReview.ownerReply.dislikes.findIndex((element) => element === foundUser.id),
                    1
                );
            }
            await this.notificationService.handleOwnerReplyLike(userToPushTo, foundUser);
            like = true;
        } else if (foundReview.ownerReply.likes.includes(foundUser.id)) {
            foundReview.ownerReply.likes.splice(
                foundReview.ownerReply.likes.findIndex((element) => element === foundUser.id),
                1
            );
            like = false;
        }
        try {
            await userToPushTo.save();
            await foundReview.save();
        } catch (err) {
            return new HttpException("Something went wrong and the review did not handle likes in the database.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        this.events.emitOwnerReplyLike(foundReview, foundUser, like);
        return foundReview.ownerReply;
    }

    public async dislike(reviewId: string, userId: string): Promise<OwnerReply | HttpException> {
        const foundReview = await this.Reviews.findById(reviewId);
        const foundUser = await this.Users.findOne({ id: userId });
        if (!foundReview || !foundUser) return new HttpException("A user or a review does not exist", HttpStatus.NOT_FOUND);

        const userToPushTo = await this.Users.findOne({ id: foundReview.userId });
        let dislike = null;
        if (!foundReview.ownerReply.dislikes.includes(foundUser.id)) {
            foundReview.ownerReply.dislikes.push(foundUser.id);
            // Remove the like of the user if like.
            if (foundReview.ownerReply.likes.includes(foundUser.id)) {
                foundReview.ownerReply.likes.splice(
                    foundReview.ownerReply.likes.findIndex((element) => element === foundUser.id),
                    1
                );
                dislike = true;
            }
            await this.notificationService.handleOwnerReplyDislike(userToPushTo, foundUser);
        } else if (foundReview.ownerReply.dislikes.includes(foundUser.id)) {
            foundReview.ownerReply.dislikes.splice(
                foundReview.ownerReply.dislikes.findIndex((element) => element === foundUser.id),
                1
            );
            dislike = false;
        }
        try {
            await userToPushTo.save();
            await foundReview.save();
        } catch (err) {
            return new HttpException("Something went wrong and the review did not handle dislikes in the db.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        this.events.emitOwnerReplyDislike(foundReview, foundUser, dislike);
        return foundReview.ownerReply;
    }

    public async delete(reviewId: string): Promise<OwnerReply | HttpException> {
        const foundReview = await this.Reviews.findById(reviewId);

        if (!foundReview) return new HttpException("The review doesn't exist.", HttpStatus.NOT_FOUND);
        if (foundReview.ownerReply.review.length === 0) return new HttpException("The ownerReply doesn't exist", HttpStatus.NOT_FOUND);

        foundReview.ownerReply.userId = "";
        foundReview.ownerReply.review = "";
        foundReview.ownerReply.likes = [];
        foundReview.ownerReply.dislikes = [];
        foundReview.ownerReply.date = null;
        foundReview.ownerReply.edited = null;

        await foundReview.save();
        this.events.emitOwnerReplyDelete(foundReview);
        return foundReview.ownerReply;
    }

}
