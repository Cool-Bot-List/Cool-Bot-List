import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PassportModule } from "@nestjs/passport";
import { User, UserSchema } from "src/user/user.schema";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthStrategy } from "./auth.strategy";
import { EventsModule } from "src/events/events.module";
import { AuthSerializer } from "./auth.serializer";
import { LoginAuthGuard } from "./login-auth.guard";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
        ]),
        PassportModule.register({ session: true }),
        EventsModule,
    ],
    providers: [AuthService, AuthStrategy, AuthSerializer, LoginAuthGuard],
    controllers: [AuthController],
})
export class AuthModule { }
