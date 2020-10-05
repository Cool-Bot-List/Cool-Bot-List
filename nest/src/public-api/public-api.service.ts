import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as jwt from "jsonwebtoken";
import { Request } from "express";
import { Model } from "mongoose";
import { Bot } from "src/bot/bot.schema";
import { EventsGateway } from "src/events/events.gateway";
import { PublicApiBotUpdatable } from "./types/public-api-bot-updatable.input";
import { User } from "src/user/user.schema";

@Injectable()
export class PublicApiService {
    constructor(
        @InjectModel(Bot.name)
        private Bots: Model<Bot>,
        @InjectModel(User.name)
        private Users: Model<User>,
        private events: EventsGateway
    ) { }

    public async update(data: PublicApiBotUpdatable): Promise<string | HttpException> {
        const { client } = data;
        const { sendTotalGuilds, sendTotalUsers, sendPresence } = data;
        let guilds: number, users: number, presenceString: string;
        const { presence } = data;

        if (!client || !presence || sendTotalGuilds === undefined || sendTotalUsers === undefined || sendPresence === undefined)
            return new HttpException("You are missing properties.", HttpStatus.BAD_REQUEST);

        const foundBot = await this.Bots.findOne({ id: client.user });
        const original = { ...foundBot };
        if (!foundBot) return new HttpException("The bot was not found.", HttpStatus.NOT_FOUND);

        sendTotalGuilds ? guilds = client.guilds.length : guilds = null;
        sendTotalUsers ? users = client.users.length : users = null;
        sendPresence ? presenceString = presence.status : presenceString = null;

        if (sendTotalGuilds) foundBot.servers = guilds;
        if (sendTotalUsers) foundBot.users = users;
        if (sendPresence) foundBot.presence = presenceString;

        try {
            await foundBot.save();
        } catch (err) {
            return new HttpException("Something went wrong and the bot didn't update", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        if (foundBot === original) {
            return "The bot is the same as before";
        }

        else {
            this.events.emitBotUpdate(foundBot);
            return "Successfully updated the bot's stats.";
        }
    }


    public async validateRequest(req: Request): Promise<boolean> {
        const jwtHeader = req.headers.authorization;
        const token = jwtHeader && jwtHeader.split(" ")[1];

        if (!token) {
            throw new HttpException("Please provide a token.", HttpStatus.BAD_REQUEST);
        }

        const decodedData = <{ user: { id: string } }>jwt.verify(token, process.env.JWT_SECRET);

        if (!decodedData) {
            throw new HttpException("The token is invalid.", HttpStatus.FORBIDDEN);
        }

        const { id } = decodedData.user;
        const foundUser = await this.Users.findOne({ id });
        if (token !== foundUser!.token) {
            throw new HttpException("The token is invalid.", HttpStatus.FORBIDDEN);
        }
        return true;
    }
}
