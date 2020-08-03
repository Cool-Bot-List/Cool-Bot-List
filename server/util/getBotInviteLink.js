/**
 * Get the invite link for any bot by its id. The returned invite link has no permissions.
 * @param {string} id - The id of the bot.
 * @returns {string} botInviteLink - The invite link of the bot with no permissions.
 */
const getBotInviteLink = (id) => `https://discordapp.com/oauth2/authorize?client_id=${id}&scope=bot&permissions=0`;

module.exports = { getBotInviteLink };
