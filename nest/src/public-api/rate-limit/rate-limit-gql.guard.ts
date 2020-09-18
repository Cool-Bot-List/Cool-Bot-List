import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Observable } from "rxjs";
import { RateLimitService } from "./rate-limit.service";

@Injectable()
export class RateLimitGqlGuard implements CanActivate {
    constructor(private service: RateLimitService) { }

    public canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        return this.service.validate(GqlExecutionContext.create(context).getContext().req);
    }
}


