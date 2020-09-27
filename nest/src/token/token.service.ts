import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as jwt from "jsonwebtoken";
import { Model } from "mongoose";
import { EventsGateway } from "src/events/events.gateway";
import { User } from "src/user/user.schema";

@Injectable()
export class TokenService {
    constructor(
        @InjectModel(User.name)
        private Users: Model<User>,
        private events: EventsGateway
    ) { }

    public async create(id: string): Promise<string | HttpException> {
        const foundUser = await this.Users.findOne({ id });
        if (!foundUser) return new HttpException("A user was not found", HttpStatus.NOT_FOUND);

        const user = { id: foundUser.id };
        const token = jwt.sign({ user }, process.env.JWT_SECRET);
        try {
            foundUser.token = token;
            await foundUser.save();
        } catch (err) {
            return new HttpException("Something went wrong while generating a token.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        this.events.emitNewToken(foundUser);
        return token;
    }
}
