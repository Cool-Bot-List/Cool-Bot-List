const Bots = require("../../database/models/Bot");

const BotResolver = {
    Query: {
        Bot: async (_parent, { id }) => await Bots.findOne({ id }),
    },
};

module.exports = BotResolver;
