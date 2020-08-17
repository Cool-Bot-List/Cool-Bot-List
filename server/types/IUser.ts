import IVote from "./IVote";
import INotification from "./INotification";

export default interface IUser {
    _id: any;
    /**
     * The discord id of the user.
     */
    id: string;
    /**
     * The discord tag of the user.
     */
    tag: string;
    /**
     * The URL to the discord avatar of the user.
     */
    avatarUrl: string;
    /**
     * The bio of the user.
     */
    bio: string;
    /**
    * An array of botIds that the user owns. 
     */
    bots: Array<string>;
    /**
    * Whether this is the first time the user has logged in. 
     */
    newUser: boolean;
    /**
    * An array of all the notifications for the user.
    */
    notifications: Array<INotification>;
    /**
     * The token used to access the api for this user.
     */
    token: string;
    /**
     * Information about the user's last vote.
     */
    vote: IVote;
}