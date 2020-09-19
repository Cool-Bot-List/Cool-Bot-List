export enum BotPresence {
    ONLINE = "online",
    DND = "dnd",
    AWAY = "away",
    INVISIBLE = "invisible",
    MOBILE = "mobile"
}

export type BotPresenceResolvable =
    BotPresence.ONLINE |
    BotPresence.DND |
    BotPresence.AWAY |
    BotPresence.INVISIBLE |
    BotPresence.MOBILE; 