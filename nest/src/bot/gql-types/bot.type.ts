import { ObjectType, Field, ID } from "@nestjs/graphql";
import { UserType } from "src/user/gql-types/user.type";
import { ReviewType } from "src/review/gql-types/review.type";

@ObjectType()
export class BotType {
    /**
     * The discord id of this bot.
     */
    @Field(() => ID)
    id: string;
    /**
     * The discord tag of this bot.
     */
    @Field()
    tag: string;
    /**
     * The URL to the discord avatar of the bot.
     */
    @Field()
    avatarUrl: string;
    /**
     * The default prefix of this bot.
     */
    @Field()
    prefix: string;
    /**
     * Information about this bot.
     */
    @Field()
    description: string;
    /**
     * An array of user objects that own this bot.
     */
    @Field(() => [UserType])
    owners: UserType[];
    /**
     * A link to the bot's website.
     * Can also be a github repo.
     */
    @Field()
    website: string;
    /**
     * The invite link for this bot.
     * Can be given by the user or the bot list can generate a link with no permissions.
     */
    @Field({ nullable: true })
    inviteLink: string;
    /**
     * The help command of the bot.
     */
    @Field()
    helpCommand: string;
    /**
     * A discord invite to the support server of the bot.
     */
    @Field({ nullable: true })
    supportServer: string;
    /**
     * The library this bot was written it.
     */
    @Field()
    library: string;
    /**
     * The average rating out of all the reviews the bot has.
     * The default is null.
     */
    @Field({ nullable: true })
    averageRating: number;
    /**
     * Whether this bot has been approved by the bot list's developers.
     */
    @Field({ nullable: true })
    isApproved: boolean;
    /**
     * An array of review objects of this bot.
     */
    @Field(() => [ReviewType])
    reviews: ReviewType[];
    /**
     * The total number of votes that this bot has received.
     */
    @Field()
    votes: number;
    /**
     * An array of tags that the bot has.
     * See constants/botTags.ts for more info.
     */
    @Field(() => [String])
    tags: string[];
    /**
     * The total amount of servers the bot is in.
     * This data is sent via the wrapper and API token.
     * For more info on the wrapper see https://github.com/Cool-Bot-List/core
     */
    @Field({ nullable: true })
    servers: number;
    /**
     * The total amount of users that are in the bot's cache.
     * This data is sent via the wrapper and API token.
     * For more info on the wrapper see https://github.com/Cool-Bot-List/core
     */
    @Field({ nullable: true })
    users: number;
    /**
     * The current presence of the bot (online, dnd, away, ect).
     * This data is sent via the wrapper and API token.
     * For more info on the wrapper see https://github.com/Cool-Bot-List/core
     */
    @Field({ nullable: true })
    presence: string;
}