require("dotenv");
const { getAvatarUrl } = require("../util/getAvatarUrl");
const { getTag } = require("../util/getAvatarUrl");
const axios = require("axios").default;

axios.defaults.headers.common["Authorization"] = `Bot ${process.env.BOT_TOKEN}`;

const getBotData = async (botId) => {
    const responce = await axios.get(`https://discord.com/api/v6/users/${botId}`);
    const avatar = getAvatarUrl(botId, responce.data.avatar);
    const tag = getTag(responce.data.username, responce.data.discriminator);
    return { tag, avatar };
};

module.exports = { getBotData };
