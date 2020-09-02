import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { Model } from "mongoose";
import { Bot } from "./bot.schema";
import { InjectModel } from "@nestjs/mongoose";
import { BotType } from "./gql-types/bot.type";
import { User } from "../user/user.schema";
import { BOT_TAGS } from "./interfaces/botTags.enum";
import { getBotInviteLink } from "./util/getBotInviteLink.util";
import { getBotData } from "./util/getBotData.util";
import { Review } from "src/review/review.schema";

@Injectable()
export class BotService {
    constructor(
        @InjectModel(Bot.name)
        private Bots: Model<Bot>,
        @InjectModel(User.name)
        private Users: Model<User>,
        @InjectModel(Review.name)
        private Reviews: Model<Review>
    ) { }

    public async getAll(): Promise<Bot[]> {
        return this.Bots.find();
    }

    public async get(id: string): Promise<Bot> {
        return this.Bots.findOne({ id });
    }

    public async getOwners(bot: BotType): Promise<User[]> {
        const owners = [];
        for (const userId of bot.owners) {
            owners.push(await this.Users.findOne({ id: userId }));
        }
        return owners;
    }

    public async getOwner(bot: BotType, id: string, index: number): Promise<User | HttpException> {
        if (id !== undefined) {
            return await this.Users.findOne({ id }) || new HttpException("That User doesn't exist.", HttpStatus.NOT_FOUND);
        } else if (index !== undefined) {
            return await this.Users.findOne({ id: bot.owners[index] }) || new HttpException("That User doesn't exist.", HttpStatus.NOT_FOUND);
        }
    }

    public async getReviews(bot: BotType): Promise<Review[]> {
        return this.Reviews.find({ botId: bot.id });
    }

    public async getReview(bot: BotType, mongoId: string, index: number): Promise<Review | HttpException> {
        if (mongoId !== undefined) {
            return await this.Reviews.findOne({ botId: bot.id, _id: mongoId })
                || new HttpException("That review doesn't exist.", HttpStatus.NOT_FOUND);
        } else if (index !== undefined) {
            return (await this.Reviews.find({ botId: bot.id }))[index] || new HttpException("That review doesn't exist.", HttpStatus.NOT_FOUND);
        }
    }

    public async create(id: string, data: BotType): Promise<Bot | HttpException> {
        const { prefix, description, owners, website, helpCommand, supportServer, library } = data;
        let { inviteLink, tags } = data;
        if (!tags) tags = [];
        if (tags.length > 3) return new HttpException("You cannot have more than 3 tags.", HttpStatus.BAD_REQUEST);
        for (const t of tags) {
            if (
                t !== BOT_TAGS.MODERATION &&
                t !== BOT_TAGS.MUSIC &&
                t !== BOT_TAGS.LEVELING &&
                t !== BOT_TAGS.FUN &&
                t !== BOT_TAGS.UTILITY &&
                t !== BOT_TAGS.DASHBOARD &&
                t !== BOT_TAGS.CUSTOMIZABLE &&
                t !== BOT_TAGS.ECONOMY
            )
                return new HttpException("One or more tags are invalid!", HttpStatus.BAD_REQUEST);
        }
        if (!inviteLink) inviteLink = getBotInviteLink(id);
        const bot = await this.Bots.findOne({ id });
        const botApiData = await getBotData(id);
        const { tag, avatarUrl } = botApiData;
        if (bot) return new HttpException("This bot already exists!", HttpStatus.BAD_REQUEST);
        const newBot = new this.Bots({
            id, tag, avatarUrl, prefix, description, owners, website, inviteLink, helpCommand, supportServer, library, tags,
        });

        for (const owner of owners) {
            const users = await this.Users.findOne({ id: owner });
            users.bots.push(id);
            try {
                await users.save();
                await newBot.save();
            } catch (err) {
                return new HttpException("Something went wrong and the bot did not save to the database!", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        // WebSocket.emit("new-bot", newBot);
        return newBot;
    }


}
