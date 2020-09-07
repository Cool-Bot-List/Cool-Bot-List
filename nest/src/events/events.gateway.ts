import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { Bot } from "src/bot/bot.schema";
import { User } from "src/user/user.schema";

@WebSocketGateway()
export class EventsGateway {

    @WebSocketServer()
    private socket: Server;


    public emitNewBot(bot: Bot): SocketIO.Namespace {
        return this.socket.emit("new-bot", bot);
    }

    public emitBotUpdate(bot: Bot): SocketIO.Namespace {
        return this.socket.emit("bot-update", bot);
    }

    public emitBotDelete(bot: Bot): SocketIO.Namespace {
        return this.socket.emit("bot-delete", bot);
    }

    public emitNewNotification(user: User): SocketIO.Namespace {
        return this.socket.emit("new-notification", user);
    }

    public emitNewUser(user: User): SocketIO.Namespace {
        return this.socket.emit("new-user", user);
    }

    public emitUserUpdate(user: User): SocketIO.Namespace {
        return this.socket.emit("user-update", user);
    }

}
