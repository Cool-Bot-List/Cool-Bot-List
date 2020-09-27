/* eslint-disable @typescript-eslint/no-empty-function */
import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { LoginAuthGuard } from "./login-auth.guard";
import { AuthService } from "./auth.service";

@Controller()
export class AuthController {
    constructor(private service: AuthService) { }

    @Get("login")
    @UseGuards(LoginAuthGuard)
    public login(): void { /* Do nothing. */ }


    @Get("login/redirect")
    @UseGuards(LoginAuthGuard)
    public async redirect(@Req() req: Request, @Res() res: Response): Promise<Response> {
        return this.service.redirect(req, res);
    }

    @Get("logout")
    public logout(@Req() req: Request, @Res() res: Response): void {
        return this.service.logout(req, res);

    }
}
