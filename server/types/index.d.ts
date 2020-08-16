declare namespace Express {
    export interface Request {
        user: {
            id: string;
            tag: string;
            avatarUrl: string;
            bio: string;
            bots: Array<string>;
            newUser: boolean;
            notifications: Array<INotification>;
            token: string;
            vote: IVote;
            [key: string]: string;
        };
    }
}
