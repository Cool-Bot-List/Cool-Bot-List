class WebSocket {
    constructor() {
        this.socket = null;
    }
    static setSocket(httpServer) {
        this.socket = require("socket.io")(httpServer);
        console.log("setting");
        return this;
    }
    static getSocket() {
        console.log("getting");
        return this.socket;
    }
}

module.exports = WebSocket;
