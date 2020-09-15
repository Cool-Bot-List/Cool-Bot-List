import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class BotSearchable {
    /**
     * An array of tags to search for.
     */
    @Field(() => [String])
    hasTags: string[];
}