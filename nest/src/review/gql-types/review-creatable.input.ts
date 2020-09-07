import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class ReviewCreatable {
    @Field()
    botId: string;
    @Field()
    userId: string;
    @Field()
    review: string;
    @Field()
    rating: number;
}