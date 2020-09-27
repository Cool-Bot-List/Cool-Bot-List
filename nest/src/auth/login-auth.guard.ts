import { AuthGuard } from "@nestjs/passport";
import { ExecutionContext } from "@nestjs/common";

export class LoginAuthGuard extends AuthGuard("discord") {
    public async canActivate(context: ExecutionContext): Promise<boolean> {
        const can = await super.canActivate(context);
        if (can) {
            const request = context.switchToHttp().getRequest();
            super.logIn(request);
        }
        return true;
    }
}