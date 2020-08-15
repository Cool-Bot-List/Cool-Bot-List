import { Request, Response } from "express";
import { config } from "dotenv";
config();
import "./database/database";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import http from "http";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import typeDefs from "./graphql/base/typeDefs";
import resolvers from "./graphql/base/resolvers";
import api from "./api/api";

const app = express();

app.use(
    cors({
        credentials: true,
    })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.json(), express.urlencoded({ extended: true }));
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
const server = http.createServer(app);
import WebSocket from "./WebSocket";
WebSocket.setSocket(server);
import "./api/oauth2/strategies/discordStrategy";

const apolloServer = new ApolloServer({
    //@ts-ignore
    typeDefs,
    //@ts-ignore
    resolvers,
    context: ({ req, res }: { req: Request; res: Response }) => ({ req, res }),
    engine: {
        reportSchema: true,
        //@ts-ignore
        variant: "current",
        apiKey: process.env.APOLLO_KEY,
    },
});

app.use("/api/bots", api.bot.route);
app.use("/api/users", api.user.route);
app.use("/api/users/token", api.user.token.route);
app.use("/api/bots/vote", api.bot.vote.route);
app.use("/api/login", api.user.oauth.login.route);
app.use("/api/bots/reviews", api.bot.review.route);
app.use("/api/users/notifications", api.user.notification.route);
app.use("/api/bots/reviews/owner-reply", api.bot.review.ownerReply.route);

apolloServer.applyMiddleware({ app });
const PORT = 5000;
server.listen(PORT, () => console.log(`Listening on ${PORT}`));
