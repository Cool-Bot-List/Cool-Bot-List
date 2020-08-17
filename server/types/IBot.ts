export default interface IBot {
    _id: any;
    /**
     * The discord id of this bot.
     */
    id: string;
    /**
     * The discord tag of this bot.
     */
    tag: string;
    /**
     * The URL to the discord avatar of the bot.
     */
    avatarUrl: string;
    /**
     * The default prefix of this bot.
     */
    prefix: string;
    /**
     * Information about this bot.
     */
    description: string;
    /**
     * An array of userIds that own this bot.
     */
    owners: Array<string>;
    /**
     * A link to the bot's website.
     * Can also be a github repo.
     */
    website: string;
    /**
     * The invite link for this bot.
     * Can be given by the user or the bot list can generate a link with no permissions.
     */
    inviteLink: string;
    /**
     * The help command of the bot.
     */
    helpCommand: string;
    /**
     * A discord invite to the support server of the bot.
     */
    supportServer: string;
    /**
     * The library this bot was written it.
     */
    library: string;
    /**
     * The average rating out of all the reviews the bot has.
     * The default is null.
     */
    averageRating: number;
    /**
     * Whether this bot has been approved by the bot list's developers.
     */
    isApproved: boolean;
    /**
     * An array of mongoIds to the review objects of this bot.
     */
    reviews: Array<string>;
    /**
     * The total number of votes that this bot has received.
     */
    votes: number;
    /**
     * An array of tags that the bot has.
     * See constants/botTags.ts for more info.
     */
    tags: Array<string>;
    /**
     * The total amount of servers the bot is in.
     * This data is sent via the wrapper and API token.
     * For more info on the wrapper see https://github.com/Cool-Bot-List/core
     */
    servers: number;
    /**
     * The total amount of users that are in the bot's cache.
     * This data is sent via the wrapper and API token.
     * For more info on the wrapper see https://github.com/Cool-Bot-List/core
     */
    users: number;
    /**
     * The current presence of the bot (online, dnd, away, ect).
     * This data is sent via the wrapper and API token.
     * For more info on the wrapper see https://github.com/Cool-Bot-List/core
     */
    presence: string;
}
