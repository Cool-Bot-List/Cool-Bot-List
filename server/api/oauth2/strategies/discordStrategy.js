const DiscordStrategy = require("passport-discord");
const passport = require("passport");
const User = require("../../../database/models/User");

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    if (user) done(null, user);
});

passport.use(new DiscordStrategy({
    clientID: "735273348875026573",
    clientSecret: "YLj5rbnzhIuV1seAQ7VeitS1pSLkGKW7",
    callbackURL: "http://localhost:5000/api/login/redirect",
    scope: ["identify", "applications.builds.read"],
}, async (accesToken, refreshToken, profile, done) => {
    try {
        const user = await User.findOne({ id: profile.id });
        if (user) {
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
}));