import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { PublicApiService } from "./public-api.service";

@Injectable()
export class PublicApiGqlGuard implements CanActivate {
    constructor(private service: PublicApiService) { }

    public canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = GqlExecutionContext.create(context);
        const request = ctx.getContext().req;
        return this.service.validateRequest(request);
    }
}