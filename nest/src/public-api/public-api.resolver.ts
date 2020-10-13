/* eslint-disable @typescript-eslint/indent */
import { HttpException, UseGuards } from "@nestjs/common";
import { Args, Context, Mutation, Resolver } from "@nestjs/graphql";
import { Request } from "express";
import { PublicApiGqlGuard } from "./public-api-gql.guard";
import { PublicApiService } from "./public-api.service";
import { RateLimitGqlGuard } from "./rate-limit/rate-limit-gql.guard";
import { PublicApiBotUpdatable } from "./types/public-api-bot-updatable.input";
import { PublicApiResponse } from "./types/public-api-response.type";

@Resolver()
export class PublicApiResolver {
    constructor(private service: PublicApiService) { }

    @Mutation(() => PublicApiResponse)
    @UseGuards(PublicApiGqlGuard, RateLimitGqlGuard)
    public updateMyBot(
        @Args("botUpdatable") botUpdatable: PublicApiBotUpdatable,
        @Context("req") req: Request
    ): Promise<{ message: string; status: number } | HttpException> {
        return this.service.update(botUpdatable, req);
    }
}
