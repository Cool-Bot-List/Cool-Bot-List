require("dotenv").config();
require("./database/database");
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const app = express();
const http = require("http");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");

const apolloServer = new ApolloServer({
    typeDefs: [require("./graphql/queries"), require("./graphql/bot/bot.type")],
    resolvers: [require("./graphql/bot/bot.resolver")],
    context: (req, res) => ({ req, res }),
    engine: {
        reportSchema: true,

        apiKey: process.env.APOLLO_KEY,
    },
});

const server = http.createServer(app);
require("./WebSocket").setSocket(server);
require("./api/oauth2/strategies/discordStrategy");

app.use(
    cors({
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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

app.use(express.json(), express.urlencoded({ extended: true }));

app.use("/api/bots", require("./api/bots"));
app.use("/api/users", require("./api/users"));
app.use("/api/users/token", require("./api/token"));
app.use("/api/bots/vote", require("./api/vote"));
app.use("/api/login", require("./api/oauth2/login"));
app.use("/api/bots/reviews", require("./api/reviews"));
app.use("/api/users/notifications", require("./api/notifications"));
app.use("/api/bots/reviews/owner-reply", require("./api/ownerReply"));

apolloServer.applyMiddleware({ app });
const PORT = 5000;
server.listen(PORT, () => console.log(`Listening on ${PORT}`));
