import Bots from "../../../database/models/Bot";
import { ValidationError } from "apollo-server-express";
import IUser from "../../../types/IUser";
import IVote from "../../../types/IVote";
import IBot from "../../../types/IBot";
export let botObj: IBot;
const BotGetResolver = {
    Query: {
        //  Get ONE bot based on its id.
        bot: async (_: unknown, { id }: { id: string }) => {
            botObj = await Bots.findOne({ id });
            module.exports = botObj;
            return botObj || new ValidationError("A bot was not found!");
        },

        // Get ALL bots in the db.
        bots: async () => await Bots.find(),
    },
    User: {
        //  When user is returned call this function
        botObj: async (parent: IUser, { id, index }: { id: string; index: number }) => {
            if (id) {
                const foundBot = await Bots.findOne({ id });
                if (foundBot) return foundBot;
            } else if (index) {
                const bots = [];
                for (const botId of parent.bots) {
                    bots.push(await Bots.findOne({ id: botId }));
                }
                return bots[index];
            }
        },
        //  When users and bots is returned call this function
        botObjs: async (parent: IUser) => {
            const bots = [];
            for (const botId of parent.bots) {
                bots.push(await Bots.findOne({ id: botId }));
            }
            return bots;
        },
    },
    Vote: {
        // Runs when a Vote is returned and botObj is asked for.
        botObj: async (parent: IVote) => await Bots.findOne({ id: parent.bot }),
    },
};

export default BotGetResolver;
