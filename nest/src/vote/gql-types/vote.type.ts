import { ObjectType, Field } from "@nestjs/graphql";
import { BotType } from "src/bot/gql-types/bot.type";

@ObjectType()
export class VoteType {
    /**
     * The time that the vote happened.
     */
    @Field({ nullable: true })
    date: Date;
    /**
     * The bot object that the vote was for.
     */
    @Field(() => BotType, { nullable: true })
    bot: BotType;
}