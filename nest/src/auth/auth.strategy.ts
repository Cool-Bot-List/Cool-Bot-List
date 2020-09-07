import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy as DiscordStrategy, Profile } from "passport-discord";
import { AuthService } from "./auth.service";
import { User } from "src/user/user.schema";


@Injectable()
export class AuthStrategy extends PassportStrategy(DiscordStrategy) {
    constructor(private authService: AuthService) {
        super({
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: "http://localhost:5000/api/login/redirect",
            scope: ["identify", "applications.builds.read"],
        });
    }

    public validate(accessToken: string, refreshToken: string, profile: Profile, done: (err: Error, user?: User) => void): Promise<User> {
        return this.authService.validateUser(accessToken, refreshToken, profile, done);
    }
}