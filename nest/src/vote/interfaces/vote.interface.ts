export interface Vote {
    /**
     * The time that the vote happened.
     */
    date: Date;
    /**
     * The botId that the vote was for.
     */
    bot: string;
}