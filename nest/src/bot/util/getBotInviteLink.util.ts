/**
 * Get the invite link for any bot by its id. The returned invite link has no permissions.
 * @param id - The id of the bot.
 * @returns The invite link of the bot with no permissions.
 */
export const getBotInviteLink = (id: string): string => `https://discordapp.com/oauth2/authorize?client_id=${id}&scope=bot&permissions=0`;
