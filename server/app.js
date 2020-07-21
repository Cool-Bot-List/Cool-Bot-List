const express = require("express");
const app = express();
const cors = require("cors");
require("./database/database");


app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use(express.json(), express.urlencoded({ extended: true }));

app.use("/api/bots", require("./api/bots"));
app.use("/api/users", require("./api/users"));
//semi colons smh
const PORT = 5000;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
