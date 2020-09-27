import { PassportSerializer } from "@nestjs/passport";
import { User } from "src/user/user.schema";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class AuthSerializer extends PassportSerializer {
    constructor(
        @InjectModel(User.name)
        private Users: Model<User>
    ) {
        super();
    }

    public serializeUser(user: User, done: (err: Error, user?: User) => void): void {
        done(null, user._id);
    }

    public async deserializeUser(id: string, done: (err: Error, user?: User) => void): Promise<void> {
        const user = await this.Users.findById(id);
        if (user) done(null, user);
    };
}