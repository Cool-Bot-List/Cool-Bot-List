import { Field, InputType } from "@nestjs/graphql";

@InputType()
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