import { Server } from "http";
import socketIO from "socket.io";

export default class WebSocket {
    static socket: SocketIO.Server;
    constructor(public socket: SocketIO.Server | null = null) {}

    static setSocket(httpServer: Server): void {
        this.socket = socketIO(httpServer);
    }
    static getSocket(): SocketIO.Server {
        return this.socket;
    }
}
