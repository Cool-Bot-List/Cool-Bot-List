import { Body, Controller, HttpException, Put, UseGuards } from "@nestjs/common";
import { PublicApiGuard } from "./public-api.guard";
import { PublicApiService } from "./public-api.service";
import { RateLimitGuard } from "./rate-limit/rate-limit.guard";
import { PublicApiBotUpdatable } from "./types/public-api-bot-updatable.input";

@Controller()
export class PublicApiController {
    constructor(private service: PublicApiService) { }

    @Put("update-my-bot")
    @UseGuards(PublicApiGuard, RateLimitGuard)
    public updateMyBot(@Body() botUpdatable: PublicApiBotUpdatable): Promise<string | HttpException> {
        return this.service.update(botUpdatable);
    }
}
