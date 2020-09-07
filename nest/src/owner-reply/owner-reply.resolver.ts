import { Resolver, ResolveField, Parent, Mutation, Args } from "@nestjs/graphql";
import { OwnerReplyService } from "./owner-reply.service";
import { UserType } from "src/user/gql-types/user.type";
import { OwnerReply } from "./interfaces/ownerReply.interface";
import { User } from "src/user/user.schema";
import { OwnerReplyType } from "./gql-types/owner-reply.type";
import { OwnerReplyCreatable } from "./gql-types/owner-reply-creatable.input";
import { HttpException } from "@nestjs/common";

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

    @Mutation(() => OwnerReplyType)
    public createOwnerReply(@Args("ownerReplyCreatable") data: OwnerReplyCreatable): Promise<OwnerReply | HttpException> {
        return this.service.create(data);
    }

    @Mutation(() => OwnerReplyType)
    public updateOwnerReply(@Args("reviewId") reviewId: string, @Args("ownerReply") ownerReply: string): Promise<OwnerReply | HttpException> {
        return this.service.update(reviewId, ownerReply);
    }

}
