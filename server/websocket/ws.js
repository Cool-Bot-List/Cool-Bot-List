const http = require("http");
const io = require("socket.io");

function startWebSocket(app) {
    http.Server(app);
    io(http);

    io.on("connection", (socket) => {
        console.log("conection happend");
    });

    http.listen(5000);
}

module.exports = startWebSocket;
