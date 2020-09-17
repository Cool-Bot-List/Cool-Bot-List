import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class BotSearchable {
    /**
     * The name of a bot to search for.
     */
    @Field({ nullable: true })
    name: string;
    /**
     * An array of tags to search for.
     */
    @Field(() => [String], { nullable: true })
    hasTags: string[];
}