export default interface IVote {
    /**
     * The time that the vote happened.
     */
    date: Date;
    /**
     * The botId that the vote was for.
     */
    bot: string;
}
