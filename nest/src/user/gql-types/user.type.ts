import { ObjectType, Field, ID } from "@nestjs/graphql";
import { VoteType } from "src/vote/gql-types/vote.type";
import { NotificationType } from "src/notification/gql-types/notification.type";
import { BotType } from "src/bot/gql-types/bot.type";

@ObjectType()
export class UserType {
    /**
     * The discord id of the user.
     */
    @Field(() => ID)
    id: string;
    /**
     * The discord tag of the user.
     */
    @Field()
    tag: string;
    /**
     * The URL to the discord avatar of the user.
     */
    @Field()
    avatarUrl: string;
    /**
     * The bio of the user.
     */
    @Field()
    bio: string;
    /**
     * An array of bot objects that the user owns. 
     */
    @Field(() => [BotType])
    bots: BotType[];
    /**
     * Whether this is the first time the user has logged in. 
     */
    @Field()
    newUser: boolean;
    /**
    * An array of all the notifications for the user.
    */
    @Field(() => [NotificationType])
    notifications: NotificationType[];
    /**
     * The token used to access the api for this user.
     */
    @Field({ nullable: true })
    token: string;
    /**
     * Information about the user's last vote.
     */
    @Field(() => VoteType, { nullable: true })
    vote: VoteType;
    /**
     * Weather this user is a admin.
     */
    @Field()
    isAdmin: boolean;

}