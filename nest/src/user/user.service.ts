import { Injectable } from "@nestjs/common";
import { User } from "./user.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name)
        private Users: Model<User>
    ) { }

    public async getAll(): Promise<User[]> {
        return this.Users.find();
    }

    public async get(id: string): Promise<User> {
        return this.Users.findOne({ id });
    }
}
