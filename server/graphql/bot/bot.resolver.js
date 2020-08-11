const Bots = require("../../database/models/Bot");
const { ValidationError } = require("apollo-server-express");

const BotResolver = {
    Query: {
        //  Get ONE bot based on its id.
        Bot: async (_parent, { id }) => {
            const foundBot = await Bots.findOne({ id });
            return foundBot || new ValidationError("A bot was not found!");
        },
        // Get ALL bots in the db.
        Bots: async () => await Bots.find(),
    },
};

module.exports = BotResolver;
