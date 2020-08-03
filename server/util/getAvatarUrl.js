/**
 * Get the avatar url for a specific user by their id and avatar.
 * @param {string} id - The id of the user.
 * @param {string} avatar - The avatar of the user.
 */
const getAvatarUrl = (id, avatar) => `https://cdn.discordapp.com/avatars/${id}/${avatar}.png?size=2048`;

module.exports = { getAvatarUrl };
