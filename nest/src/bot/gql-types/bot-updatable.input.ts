import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class BotUpdatable {
    @Field()
    id: string;
    @Field({ nullable: true })
    tag: string;
    @Field({ nullable: true })
    avatarUrl: string;
    @Field({ nullable: true })
    prefix: string;
    @Field({ nullable: true })
    description: string;
    @Field(() => [String], { nullable: true })
    owners: string[];
    @Field({ nullable: true })
    website: string;
    @Field({ nullable: true })
    helpCommand: string;
    @Field({ nullable: true })
    supportServer: string;
    @Field({ nullable: true })
    library: string;
    @Field({ nullable: true })
    averageRating: number;
    @Field({ nullable: true })
    isApproved: boolean;
    @Field({ nullable: true })
    votes: number;
    @Field({ nullable: true })
    inviteLink: string;
    @Field(() => [String], { nullable: true })
    tags: string[];
    @Field({ nullable: true })
    servers: number;
    @Field({ nullable: true })
    users: number;
    @Field({ nullable: true })
    presence: string;
    @Field(() => [String], { nullable: true })
    reviews: string[];
}