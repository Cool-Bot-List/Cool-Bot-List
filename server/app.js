const express = require("express");
const session = require("express-session");
const passport = require("passport");
// const DiscordStrategy = require("./api/oauth2/strategies/discordStrategy");
const app = express();
require("./database/database");
require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        secret: "Testing",
        cookie: {
            maxAge: 60 * 1000 * 60 * 24,
        },
        saveUninitialized: false,
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json(), express.urlencoded({ extended: true }));

app.use("/api/bots", require("./api/bots"));
app.use("/api/users", require("./api/users"));
app.use("/api/bots/reviews", require("./api/reviews"));
app.use("/api", require("./api/oauth2/login"));
app.use("/api/users/notifications", require("./api/notifications"));

//semi colons smh
const PORT = 5000;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
