import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { Bot } from "src/bot/bot.schema";

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

}
