import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Review } from "src/review/review.schema";
import { User } from "src/user/user.schema";
import { OwnerReply } from "./interfaces/ownerReply.interface";


@Injectable()
export class OwnerReplyService {
    constructor(
        @InjectModel(Review.name)
        private Reviews: Model<Review>,
        @InjectModel(User.name)
        private Users: Model<User>
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


}
