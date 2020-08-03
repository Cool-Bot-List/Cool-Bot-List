require("dotenv").config();
const { getAvatarUrl } = require("../util/getAvatarUrl");
const { getTag } = require("../util/getTag");
const axios = require("axios").default;

axios.defaults.headers.common["Authorization"] = `Bot ${process.env.BOT_TOKEN}`;

/**
 *  Get the tag and avatar url of a bot based on its id.
 *
 * @typedef {object} BotData - An object with the bot tag and avatar url
 * @property {string} tag - The tag of the bot.
 * @property {string} avatarUrl - The url to the bots avatar.
 *
 * @param {string} botId - The discord id of the bot.
 * @returns {BotData}
 */
const getBotData = async (botId) => {
    const { data } = await axios.get(`https://discord.com/api/v6/users/${botId}`);
    const avatarUrl = getAvatarUrl(botId, data.avatar);
    const tag = getTag(data.username, data.discriminator);
    return { tag, avatarUrl };
};

module.exports = { getBotData };
