import { InputType, Field, ID } from "@nestjs/graphql";

@InputType()
export class BotCreatable {
    @Field(() => ID)
    id: string;
    @Field()
    prefix: string;
    @Field()
    description: string;
    @Field(() => [String])
    owners: string[];
    @Field({ nullable: true })
    website: string;
    @Field()
    helpCommand: string;
    @Field({ nullable: true })
    supportServer: string;
    @Field()
    library: string;
    @Field({ nullable: true })
    inviteLink: string;
    @Field(() => [String], { nullable: true })
    tags: string[];
}