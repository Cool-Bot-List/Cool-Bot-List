import { Resolver, ResolveField, Parent } from "@nestjs/graphql";
import { OwnerReplyService } from "./owner-reply.service";
import { UserType } from "src/user/gql-types/user.type";
import { OwnerReply } from "./interfaces/ownerReply.interface";
import { User } from "src/user/user.schema";
import { OwnerReplyType } from "./gql-types/owner-reply.type";

@Resolver(() => OwnerReplyType)
export class OwnerReplyResolver {

    constructor(private service: OwnerReplyService) { }

    @ResolveField("user", () => UserType)
    public user(@Parent() ownerReply: OwnerReply): Promise<User> {
        return this.service.getUser(ownerReply);
    }

    @ResolveField("likes", () => [UserType])
    public likes(@Parent() ownerReply: OwnerReply): Promise<User[]> {
        return this.service.getUsersThatLiked(ownerReply);
    }

    @ResolveField("dislikes", () => [UserType])
    public dislikes(@Parent() ownerReply): Promise<User[]> {
        return this.service.getUsersThatDisliked(ownerReply);
    }
}
