import { config } from "dotenv";
config();
import { getAvatarUrl } from "../util/getAvatarUrl";
import { getTag } from "../util/getTag";
import axios from "axios";
import BotDataResponse from "../types/BotDataResponse";

axios.defaults.headers.common["Authorization"] = `Bot ${process.env.BOT_TOKEN}`;

/**
 *  Get the tag and avatar url of a bot based on its id.
 *
 * @typedef BotData - An object with the bot tag and avatar url
 * @property tag - The tag of the bot.
 * @property avatarUrl - The url to the bots avatar.
 *
 * @param botId - The discord id of the bot.
 */
export const getBotData = async (botId: string): Promise<BotDataResponse> => {
    const { data } = await axios.get(`https://discord.com/api/v6/users/${botId}`);
    const avatarUrl = getAvatarUrl(botId, data.avatar);
    const tag = getTag(data.username, data.discriminator);
    return { tag, avatarUrl };
};
