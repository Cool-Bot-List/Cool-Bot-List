const Bots = require("../../database/models/Bot");

const VoteResolver = {
    User: {
        //  Runs whenever a user is requested and a vote is in the request.
        //  Finds the bot object for the vote.
        vote: async (parent) => {
            return await Bots.findOne({ id: parent.vote.bot });
        },
    },
};

module.exports = VoteResolver;
