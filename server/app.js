const express = require("express");
const http = require("http");
const app = express();
require("./database/database");

const server = http.createServer(app);
require("./websocket/ws").setSocket(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.json(), express.urlencoded({ extended: true }));

app.use("/api/bots", require("./api/bots"));
app.use("/api/users", require("./api/users"));
app.use("/api/bots/reviews", require("./api/reviews"));

//semi colons smh
const PORT = 5000;
server.listen(PORT, () => console.log(`Listening on ${PORT}`));
