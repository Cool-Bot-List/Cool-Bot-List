/* eslint-disable @typescript-eslint/indent */
import { Body, Controller, HttpException, Put, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { PublicApiGuard } from "./public-api.guard";
import { PublicApiService } from "./public-api.service";
import { RateLimitGuard } from "./rate-limit/rate-limit.guard";
import { PublicApiBotUpdatable } from "./types/public-api-bot-updatable.input";

@Controller()
export class PublicApiController {
    constructor(private service: PublicApiService) { }

    @Put("update-my-bot")
    @UseGuards(PublicApiGuard, RateLimitGuard)
    public updateMyBot(
        @Body() botUpdatable: PublicApiBotUpdatable,
        @Req() req: Request
    ): Promise<{ message: string; status: number } | HttpException> {
        return this.service.update(botUpdatable, req);
    }
}
