const DiscordStrategy = require("passport-discord").Strategy;
const passport = require("passport");
const User = require("../../../database/models/User");
require("dotenv").config();

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
                    user.username = profile.username;
                    user.discriminator = profile.discriminator;
                    await user.save();
                    done(null, user);
                } else {
                    const newUser = new User({
                        id: profile.id,
                        discriminator: profile.discriminator,
                        username: profile.username,
                        avatarUrl: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png?size=2048`,
                    });
                    const savedUser = await newUser.save();
                    done(null, savedUser);
                }
            } catch (err) {
                console.log(err);
                done(err, null);
            }
        }
    )
);
