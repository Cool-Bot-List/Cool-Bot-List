export default interface IBot {
    _id: any;
    id: string;
    tag: string;
    avatarUrl: string;
    prefix: string;
    description: string;
    owners: Array<string>;
    website: string;
    inviteLink: string;
    helpCommand: string;
    supportServer: string;
    library: string;
    averageRating: number;
    isApproved: boolean;
    reviews: Array<string>;
    votes: number;
    tags: Array<string>;
    servers: number;
    users: number;
    presence: string;
}
