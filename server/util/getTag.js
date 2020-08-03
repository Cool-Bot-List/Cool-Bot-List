/**
 * Get the tag of an user by their username and discriminator
 * @param {string} username - The username of the user.
 * @param {string} discriminator - The username of the discriminator.
 * @returns {string} username#discriminator
 */
const getTag = (username, discriminator) => `${username}#${discriminator}`;

module.exports = { getTag }
