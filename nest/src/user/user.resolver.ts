import { Resolver, Query, Args } from "@nestjs/graphql";
import { UserService } from "./user.service";
import { UserType } from "./gqlTypes/user.type";
import { User } from "./user.schema";

@Resolver(() => UserType)
export class UserResolver {
    constructor(private service: UserService) { }

    @Query(() => [UserType], { nullable: true })
    public users(): Promise<User[]> {
        return this.service.getAll();
    }

    @Query(() => UserType, { nullable: true })
    public user(@Args("id") id: string): Promise<User> {
        return this.service.get(id);
    }
}

