const Bots = require("../../database/models/Bot");
const { ValidationError } = require("apollo-server-express");

const BotResolver = {
    Query: {
        //  Get ONE bot based on its id.
        bot: async (_, { id }) => (await Bots.findOne({ id })) || new ValidationError("A bot was not found!"),

        // Get ALL bots in the db.
        bots: async () => await Bots.find(),
    },
    User: {
        //  When user is returned call this function
        botObj: async (parent, { id, index }) => {
            if (id) {
                const foundBot = await Bots.findOne({ id });
                if (foundBot) return foundBot;
            } else if (index) {
                let bots = [];
                for (const botId of parent.bots) {
                    bots.push(await Bots.findOne({ id: botId }));
                }
                return bots[index];
            }
        },
        //  When users and bots is returned call this function
        botObjs: async (parent) => {
            let bots = [];
            for (const botId of parent.bots) {
                bots.push(await Bots.findOne({ id: botId }));
            }
            return bots;
        },
    },
    Vote: {
        // Runs when a Vote is returned and botObj is asked for.
        botObj: async (parent) => await Bots.findOne({ id: parent.bot }),
    },
};

module.exports = BotResolver;
