import IVote from "./IVote";
import INotification from "./INotification";

export default interface IUser {
    _id: any;
    id: string;
    tag: string;
    avatarUrl: string;
    bio: string;
    bots: Array<string>;
    newUser: boolean;
    notifications: Array<INotification>;
    token: string;
    vote: IVote;
}
