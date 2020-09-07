import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class OwnerReplyCreatable {
    @Field()
    ownerId: string;
    @Field()
    reviewId: string;
    @Field()
    review: string;
}