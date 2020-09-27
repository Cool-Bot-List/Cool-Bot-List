import { getTag } from "./get-tag.util";
import axios from "axios";
import BotDataResponse from "../interfaces/bot-data-response.interface";
import { getAvatarUrl } from "./get-avatar-url.util";

axios.defaults.headers.common["Authorization"] = `Bot ${process.env.BOT_TOKEN}`;

/**
 *  Get the tag and avatar url of a bot based on its id.
 * @param botId - The discord id of the bot.
 */
export const getBotData = async (botId: string): Promise<BotDataResponse> => {
    const { data } = await axios.get(`https://discord.com/api/v6/users/${botId}`);
    const avatarUrl = getAvatarUrl(botId, data.avatar);
    const tag = getTag(data.username, data.discriminator);
    return { tag, avatarUrl };
};
