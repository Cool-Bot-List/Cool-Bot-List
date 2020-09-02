import { Injectable } from "@nestjs/common";
import { User } from "./user.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Bot } from "src/bot/bot.schema";
import { Vote } from "src/vote/interfaces/vote.interface";

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name)
        private Users: Model<User>,
        @InjectModel(Bot.name)
        private Bots: Model<Bot>
    ) { }

    public async getAll(): Promise<User[]> {
        return this.Users.find();
    }

    public async get(id: string): Promise<User> {
        return this.Users.findOne({ id });
    }

    public async getVote(user: User): Promise<Vote> {
        if (user.vote.bot === null || user.vote.date === null) return null;
        return user.vote;
    }
}
