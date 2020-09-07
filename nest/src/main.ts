import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as session from "express-session";
import * as passport from "passport";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix("api");
    app.use(
        session({
            secret: "Testing",
            cookie: {
                maxAge: 60 * 1000 * 60 * 24,
            },
            resave: false,
            saveUninitialized: false,
        })
    );
    app.use(passport.initialize());
    app.use(passport.session());

    await app.listen(5000);
}
bootstrap();
