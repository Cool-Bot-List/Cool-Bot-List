import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as session from "express-session";
import * as passport from "passport";
import { environment } from "./environment/environment";

console.log(environment);
async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule);
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
    app.enableCors();

    await app.listen(environment.PORT);
}
bootstrap();
