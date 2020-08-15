import IOwnerReply from "./IOwnerReply";

export default interface IReview {
    _id: any;
    botId: string;
    userId: string;
    review: string;
    ownerReply: IOwnerReply;
    likes: Array<string>;
    dislikes: Array<string>;
    rating: number;
    date: Date;
}
