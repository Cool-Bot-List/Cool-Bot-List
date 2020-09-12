import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class ClientType {
    @Field()
    user: string;

    @Field(() => [String])
    guilds: string[];

    @Field(() => [String])
    users: string[];
}