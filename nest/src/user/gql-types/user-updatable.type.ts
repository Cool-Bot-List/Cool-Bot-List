import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class UserUpdatable {
    @Field()
    id: string;
    @Field({ nullable: true })
    tag: string;
    @Field({ nullable: true })
    avatarUrl: string;
    @Field({ nullable: true })
    bio: string;
    @Field({ nullable: true })
    newUser: boolean;
}