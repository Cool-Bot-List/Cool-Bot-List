/**
 * Get the avatar url for a specific user by their id and avatar.
 * @param id - The id of the user.
 * @param avatar - The avatar of the user.
 */
export const getAvatarUrl = (id: string, avatar: string): string => `https://cdn.discordapp.com/avatars/${id}/${avatar}.png?size=2048`;
