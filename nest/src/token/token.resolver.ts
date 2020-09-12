import { HttpException } from "@nestjs/common";
import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { TokenService } from "./token.service";

@Resolver()
export class TokenResolver {
    constructor(private service: TokenService) { }

    @Mutation(() => String)
    public createToken(@Args("id") id: string): Promise<string | HttpException> {
        return this.service.create(id);
    }
}
