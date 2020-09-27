import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class PresenceType {
    @Field()
    status: string;
}