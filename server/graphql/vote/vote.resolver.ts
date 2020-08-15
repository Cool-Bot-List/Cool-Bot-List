import Bots from "../../database/models/Bot";
import IUser from "../../types/IUser";

const VoteResolver = {
    User: {
        //  Runs whenever a user is requested and a vote is in the request.
        //  Finds the bot object for the vote.
        vote: async (parent: IUser) => {
            return await Bots.findOne({ id: parent.vote.bot });
        },
    },
};

export default VoteResolver;
