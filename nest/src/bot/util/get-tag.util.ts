/**
 * Get the tag of an user by their username and discriminator
 * @param username - The username of the user.
 * @param discriminator - The username of the discriminator.
 * @returns username#discriminator
 */
export const getTag = (username: string, discriminator: string): string => `${username}#${discriminator}`;
