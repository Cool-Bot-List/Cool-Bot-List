import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Bot } from "src/bot/bot.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { VoteType } from "./gql-types/vote.type";
import { Vote } from "./interfaces/vote.interface";
import { User } from "src/user/user.schema";
import { EventsGateway } from "src/events/events.gateway";
import { NotificationService } from "src/notification/notification.service";
import { VoteTimes } from "./constants/vote-times.enum";

@Injectable()
export class VoteService {
    constructor(
        @InjectModel(Bot.name)
        private Bots: Model<Bot>,
        @InjectModel(User.name)
        private Users: Model<User>,
        private events: EventsGateway,
        private notificationService: NotificationService
    ) { }

    public async getBot(vote: VoteType): Promise<Bot | null> {
        return this.Bots.findOne({ id: vote.bot });
    }

    public async vote(botId: string, userId: string): Promise<Vote | HttpException> {
        const foundUser = await this.Users.findOne({ id: userId });
        const foundBot = await this.Bots.findOne({ id: botId });

        if (!foundUser) return new HttpException("That user doesn't exist in the database.", HttpStatus.NOT_FOUND);
        if (!foundBot) return new HttpException("That bot doesn't exist in the database.", HttpStatus.NOT_FOUND);

        if (foundUser.vote.date !== null && VoteTimes.TWELVE_HOURS - (Date.now() - foundUser.vote.date.getTime()) > 0)
            return new HttpException("You can't vote again yet!", HttpStatus.FORBIDDEN);

        foundUser.vote.date = new Date();
        foundUser.vote.bot = foundBot.id;
        foundBot.votes += 1;

        try {
            await foundUser.updateOne(foundUser);
            await foundBot.updateOne(foundBot);
        } catch (err) {
            return new HttpException("Something went wrong while saving the votes to the database.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        this.events.emitNewVote(foundUser, foundBot);
        return foundUser.vote;
    }
}
