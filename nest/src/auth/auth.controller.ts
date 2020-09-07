/* eslint-disable @typescript-eslint/no-empty-function */
import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { LoginAuthGuard } from "./login-auth.guard";
import { AuthService } from "./auth.service";

@Controller("login")
export class AuthController {
    constructor(private service: AuthService) { }

    @Get()
    @UseGuards(LoginAuthGuard)
    public login(): void { /* Do nothing. */ }


    @Get("redirect")
    @UseGuards(LoginAuthGuard)
    public async redirect(@Req() req: Request, @Res() res: Response): Promise<Response> {
        return this.service.redirect(req, res);
    }
}
