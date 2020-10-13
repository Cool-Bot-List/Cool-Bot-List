import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class PublicApiResponse {

    /**
     * The message of the response.
     */
    @Field()
    message: string;

    /**
     * The status code of the response.
     */
    @Field()
    status: number;
}