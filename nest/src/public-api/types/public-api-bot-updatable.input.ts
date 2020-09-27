import { Field, InputType } from "@nestjs/graphql";
import { ClientType } from "./client.type";
import { PresenceType } from "./presence.type";

@InputType()
export class PublicApiBotUpdatable {
    /**
     * The client/discord bot that is being updated.
     */
    @Field(() => ClientType)
    client: ClientType;

    /**
     * The presence of the bot
     */
    @Field(() => PresenceType)
    presence: PresenceType;

    /**
     * Weather to send the total amount of guilds.
     * There is no default.
     */
    @Field()
    sendTotalGuilds: boolean;

    /**
     * Weather to send the total amount of users.
     * There is no default.
     */
    @Field()
    sendTotalUsers: boolean;


    /**
     * Weather to send the presence of the bot.
     * There is no default.
     */
    @Field()
    sendPresence: boolean;
}