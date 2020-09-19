import { Field, InputType } from "@nestjs/graphql";
import { BotLibraryResolvable } from "../constants/bot-libraries.enum";
import { BotPresenceResolvable } from "../constants/bot-presence.enum";

@InputType()
export class BotSearchable {
    /**
     * The tag of a bot to search for.
     */
    @Field({ nullable: true })
    tag: string;

    /**
     * An array of tags that the found bots should have.
     * The bots that it finds must include 1 of the tags in this array.
     */
    @Field(() => [String], { nullable: true })
    tags: string[];

    /**
     * An library the found bots should be made in.
     */
    @Field({ nullable: true })
    library: BotLibraryResolvable;

    /**
     * Found bots should have at least this amount of servers.
     */
    @Field({ nullable: true })
    minServers: number;

    /**
     * Found bots should have at least this amount of users.
     */
    @Field({ nullable: true })
    minUsers: number;

    /**
     * Found bots should have this as their presence.
     */
    @Field({ nullable: true })
    presence: BotPresenceResolvable;
}