import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "src/user/user.schema";
import { Model } from "mongoose";
import { Profile } from "passport-discord";
import { getTag } from "src/bot/util/get-tag.util";
import { EventsGateway } from "src/events/events.gateway";
import { getAvatarUrl } from "src/bot/util/get-avatar-url.util";
import { Request, Response } from "express";

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private Users: Model<User>,
        private events: EventsGateway
    ) { }

    public async validateUser(accessToken: string, refreshToken: string, profile: Profile, done: (err: Error, user?: User) => void): Promise<User> {
        try {
            const user = await this.Users.findOne({ id: profile.id });
            if (user) {
                const url = getAvatarUrl(profile.id, profile.avatar);
                const tag = getTag(profile.username, profile.discriminator);

                if (user.avatarUrl === url && user.tag === tag) return user;

                user.avatarUrl = url.includes("null")
                    ? "https://discordapp.com/assets/322c936a8c8be1b803cd94861bdfa868.png"
                    : url;
                user.tag = tag;

                await user.save();
                this.events.emitUserUpdate(user);
                done(null, user);
                return user;

            } else {
                const url = getAvatarUrl(profile.id, profile.avatar);

                const newUser = new this.Users({
                    id: profile.id,
                    tag: getTag(profile.username, profile.discriminator),
                    avatarUrl: url.includes("null")
                        ? "https://discordapp.com/assets/322c936a8c8be1b803cd94861bdfa868.png"
                        : url,
                });

                await newUser.save();
                this.events.emitNewUser(newUser);
                done(null, newUser);
                return user;
            }
        } catch (err) {
            console.log(err);
            done(err, null);
            return null;
        }
    }

    public async redirect(req: Request, res: Response): Promise<Response> {
        const user = <User>req.user;
        if (user.newUser) {
            res.redirect("http://localhost:3000/new-user");
            const foundUser = await this.Users.findOne({ id: user.id });
            foundUser.newUser = false;
            await foundUser.save();
        } else if (!user.newUser) {
            res.redirect(`http://localhost:3000/users/${user.id}`);
        } else {
            res.redirect("http://localhost:3000");
        }
        return res.status(200).json({ message: "Successfully redirected." });
    }

    public logout(req: Request, res: Response): void {
        if (!req.user) return;
        this.events.emitUserLogout(<User>req.user);
        req.logOut();
        res.redirect("http://localhost:3000");
    }
}
