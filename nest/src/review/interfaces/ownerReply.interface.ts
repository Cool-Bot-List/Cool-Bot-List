export interface OwnerReply {
    /**
     * The id of the user that made this owner reply.
     */
    userId: string;
    /**
     * The actual content of this owner reply.
     */
    review: string;
    /**
     * An array of userIds that have liked this ownerReply.
     */
    likes: Array<string>;
    /**
     * An array of userIds that have disliked this ownerReply.
     */
    dislikes: Array<string>;
    /**
     * The date this ownerReply was made.
     */
    date: Date;
}