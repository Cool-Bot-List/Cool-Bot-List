const getBotInviteLink = (id) => `https://discordapp.com/oauth2/authorize?client_id=${id}&scope=bot&permissions=0`;

module.exports = { getBotInviteLink };
