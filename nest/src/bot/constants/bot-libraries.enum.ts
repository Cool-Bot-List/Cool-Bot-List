export enum BotLibraries {
    DISCORDJS = "Discord.js",
    DISCORDPY = "Discord.py",
    DISCORDNET = "Discord.NET",
    DSHARPPLUS = "DSharpPlus",
    JDA = "JDA",
    JAVACORD = "JavaCord",
    ERIS = "Eris"
}

export type BotLibraryResolvable =
    BotLibraries.DISCORDJS |
    BotLibraries.DISCORDPY |
    BotLibraries.DISCORDNET |
    BotLibraries.DSHARPPLUS |
    BotLibraries.JDA |
    BotLibraries.JAVACORD |
    BotLibraries.ERIS;


