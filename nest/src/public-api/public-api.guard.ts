import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { PublicApiService } from "./public-api.service";

@Injectable()
export class PublicApiGuard implements CanActivate {
    constructor(private service: PublicApiService) { }

    public canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.service.validateRequest(request);
    }
}
