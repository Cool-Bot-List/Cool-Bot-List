import { Document } from "mongoose";
import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose";

@Schema()
export class Bot extends Document {
    /**
     * The discord id of this bot.
     */
    @Prop({ unique: true })
    id: string;
    /**
     * The discord tag of this bot.
     */
    @Prop()
    tag: string;
    /**
     * The URL to the discord avatar of the bot.
     */
    @Prop()
    avatarUrl: string;
    /**
     * The default prefix of this bot.
     */
    @Prop()
    prefix: string;
    /**
     * Information about this bot.
     */
    @Prop()
    description: string;
    /**
     * An array of userIds that own this bot.
     */
    @Prop()
    owners: string[];
    /**
     * A link to the bot's website.
     * Can also be a github repo.
     */
    @Prop()
    website: string;
    /**
     * The invite link for this bot.
     * Can be given by the user or the bot list can generate a link with no permissions.
     */
    @Prop()
    inviteLink: string;
    /**
     * The help command of the bot.
     */
    @Prop()
    helpCommand: string;
    /**
     * A discord invite to the support server of the bot.
     */
    @Prop()
    supportServer: string;
    /**
     * The library this bot was written it.
     */
    @Prop()
    library: string;
    /**
     * The average rating out of all the reviews the bot has.
     * The default is null.
     */
    @Prop({ default: null, required: false })
    averageRating: number;
    /**
     * Whether this bot has been approved by the bot list's developers.
     */
    @Prop({ default: null, required: false })
    isApproved: boolean;
    /**
     * An array of mongoIds to the review objects of this bot.
     */
    @Prop({ default: [], required: false })
    reviews: string[];
    /**
     * The total number of votes that this bot has received.
     */
    @Prop({ default: 0, required: false })
    votes: number;
    /**
     * An array of tags that the bot has.
     * See constants/botTags.ts for more info.
     */
    @Prop({ default: [], required: false })
    tags: string[];
    /**
     * The total amount of servers the bot is in.
     * This data is sent via the wrapper and API token.
     * For more info on the wrapper see https://github.com/Cool-Bot-List/core
     */
    @Prop({ default: null, required: false })
    servers: number;
    /**
     * The total amount of users that are in the bot's cache.
     * This data is sent via the wrapper and API token.
     * For more info on the wrapper see https://github.com/Cool-Bot-List/core
     */
    @Prop({ default: null, required: false })
    users: number;
    /**
     * The current presence of the bot (online, dnd, away, ect).
     * This data is sent via the wrapper and API token.
     * For more info on the wrapper see https://github.com/Cool-Bot-List/core
     */
    @Prop({ default: null, required: false })
    presence: string;
}

export const BotSchema = SchemaFactory.createForClass(Bot);