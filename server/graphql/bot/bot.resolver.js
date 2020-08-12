const Bots = require("../../database/models/Bot");
const { ValidationError } = require("apollo-server-express");

const BotResolver = {
    Query: {
        //  Get ONE bot based on its id.
        bot: async (_, { id }) => {
            return (await Bots.findOne({ id })) || new ValidationError("A bot was not found!");
        },
        // Get ALL bots in the db.
        bots: async () => await Bots.find(),
    },
};

module.exports = BotResolver;
