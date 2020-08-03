class WebSocket {
    constructor() {
        this.socket = null;
    }
    static setSocket(httpServer) {
        this.socket = require("socket.io")(httpServer);
    }
    static getSocket() {
        return this.socket;
    }
}

module.exports = WebSocket;
