const express = require("express");
const app = express();
require("./database/database");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.json(), express.urlencoded({ extended: true }));

app.use("/api/bots", require("./api/bots"));
app.use("/api/bots", require("./api/reviews"));

const PORT = 5000;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));