class WebSocket {
    constructor() {
        this.socket = null;
    }
    setSocket(httpServer) {
        this.socket = require("socket.io")(httpServer);
        console.log("setting");
    }
    getSocket() {
        return this.socket;
    }
}

module.exports = new WebSocket();
