const Bots = require("../../database/models/Bot");

const BotResolver = {
    Query: {
        Bot: async (_parent, { id }) => await Bots.findOne({ id }),
        Bots: async () => await Bots.find(),
    },
};

module.exports = BotResolver;
