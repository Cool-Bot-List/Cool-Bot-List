import { Module } from "@nestjs/common";
import { OwnerReplyResolver } from "./owner-reply.resolver";
import { MongooseModule } from "@nestjs/mongoose";
import { Review, ReviewSchema } from "src/review/review.schema";
import { User, UserSchema } from "src/user/user.schema";
import { OwnerReplyService } from "./owner-reply.service";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Review.name, schema: ReviewSchema },
            { name: User.name, schema: UserSchema },
        ]),
    ],
    providers: [OwnerReplyResolver, OwnerReplyService],
})
export class OwnerReplyModule { }
