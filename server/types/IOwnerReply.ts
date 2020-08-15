export default interface IOwnerReply {
    userId: string;
    review: string;
    likes: Array<string>;
    dislikes: Array<string>;
    date: Date;
}
