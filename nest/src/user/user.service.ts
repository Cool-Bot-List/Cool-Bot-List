import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { User } from "./user.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Bot } from "src/bot/bot.schema";
import { Vote } from "src/vote/interfaces/vote.interface";
import { UserUpdatable } from "./gql-types/user-updatable.type";
import { EventsGateway } from "src/events/events.gateway";

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name)
        private Users: Model<User>,
        @InjectModel(Bot.name)
        private Bots: Model<Bot>,
        private events: EventsGateway
    ) { }

    public async getAll(): Promise<User[]> {
        return this.Users.find();
    }

    public async get(id: string): Promise<User> {
        return this.Users.findOne({ id });
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
}
