import { Injectable } from "@nestjs/common";
import { Bot } from "src/bot/bot.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { VoteType } from "./gql-types/vote.type";

@Injectable()
export class VoteService {
    constructor(
        @InjectModel(Bot.name)
        private Bots: Model<Bot>
    ) { }

    public async getBot(vote: VoteType): Promise<Bot | null> {
        return this.Bots.findOne({ id: vote.bot });
    }
}
