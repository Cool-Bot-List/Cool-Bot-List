import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Review } from "./review.schema";
import { Model } from "mongoose";
import { User } from "src/user/user.schema";
import { Bot } from "src/bot/bot.schema";

@Injectable()
export class ReviewService {
    constructor(
        @InjectModel(Review.name)
        private Reviews: Model<Review>,
        @InjectModel(User.name)
        private Users: Model<User>,
        @InjectModel(Bot.name)
        private Bots: Model<Bot>
    ) { }

    public async getBot(review: Review): Promise<Bot> {
        return this.Bots.findOne({ id: review.botId });
    }

    public async getUser(review: Review): Promise<User> {
        return await this.Users.findOne({ id: review.userId });
    }

    public async usersThatLiked(review: Review): Promise<User[]> {
        const users: User[] = [];
        console.log(users);
        for (const id of review.userId) {
            console.log(await this.Users.findOne({ id }));
            users.push(await this.Users.findOne({ id }));
        }

        return users;
    }
}
