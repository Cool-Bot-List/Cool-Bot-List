import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Request } from "express";

@Injectable()
export class RateLimitService {

    private map = new Map<string, Date>();
    private ip: string;
    private amount = 60000;

    private get rateLimitAddedAt(): number { return this.map.get(this.ip).getTime(); }


    public validate(req: Request): boolean {
        console.log("Rate Limit", this.map);
        this.ip = req.headers.authorization.split(" ")[1];

        if (!this.map.has(this.ip)) return this.add();
        else return this.throwError();
    }

    private add(): boolean {
        this.map.set(this.ip, new Date());
        this.scheduleDelete();
        return true;
    }

    private throwError(): boolean {
        throw new HttpException(`You have been rate limited. You can't call the api for another ${this.calc()} seconds`, HttpStatus.REQUEST_TIMEOUT);
    }

    private calc(): number {
        const canReqAgainAt = this.rateLimitAddedAt + this.amount;
        return (canReqAgainAt - Date.now()) / 1000;
    }

    private scheduleDelete(): void {
        setTimeout(() => {
            this.map.delete(this.ip);
        }, this.amount);
    }
}
