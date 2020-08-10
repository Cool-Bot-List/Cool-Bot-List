class WebSocket {
    constructor() {
        this.socket = null;
    }
    static setSocket(httpServer) {
        console.log(this);
        this.socket = require("socket.io")(httpServer);
        console.log(this);
    }
    static getSocket() {
        return this.socket;
    }
}

module.exports = WebSocket;
