require("dotenv").config();
const DiscordStrategy = require("passport-discord").Strategy;
const passport = require("passport");
const User = require("../../../database/models/User");
const { getTag } = require("../../../util/getTag");

const WebSocket = require("../../../websocket/ws").getSocket();

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    if (user) done(null, user);
});

passport.use(
    new DiscordStrategy(
        {
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: "http://localhost:5000/api/login/redirect",
            scope: ["identify", "applications.builds.read"],
        },
        async (accesToken, refreshToken, profile, done) => {
            try {
                // console.log(process.env.CLIENT_SECERT);
                const user = await User.findOne({ id: profile.id });
                if (user) {
                    user.avatarUrl = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png?size=2048`;
                    user.tag = getTag(profile.username, profile.discriminator);
                    await user.save();
                    WebSocket.emit("user-update", user);
                    done(null, user);
                } else {
                    const newUser = new User({
                        id: profile.id,
                        tag: getTag(profile.username, profile.discriminator),
                        avatarUrl: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png?size=2048`,
                    });
                    const savedUser = await newUser.save();
                    WebSocket.emit("new-user", newUser);
                    done(null, savedUser);
                }
            } catch (err) {
                console.log(err);
                done(err, null);
            }
        }
    )
);
