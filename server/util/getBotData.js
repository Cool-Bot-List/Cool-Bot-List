require("dotenv").config();
const { getAvatarUrl } = require("../util/getAvatarUrl");
const { getTag } = require("../util/getTag");
const axios = require("axios").default;

axios.defaults.headers.common["Authorization"] = `Bot ${process.env.BOT_TOKEN}`;

/**
 * Get the tag and avatar url of a bot based on its id.
 * @param {string} botId - The discord id of the bot.
 * @type {object} data - Returns an object with the bot tag and avatar url
 * @property {string} data.tag - the tag of the bot
 * @returns {object} a
 */
const getBotData = async (botId) => {
    const response = await axios.get(`https://discord.com/api/v6/users/${botId}`);
    const avatarUrl = getAvatarUrl(botId, response.data.avatar);
    const tag = getTag(response.data.username, response.data.discriminator);
    return { tag, avatarUrl };
};

module.exports = { getBotData };
