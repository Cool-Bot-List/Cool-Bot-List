const express = require("express");
const app = express();
const database = require("./database/database");

async function test() {
    await database;
}
test();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.json(), express.urlencoded({ extended: true }));

app.use("/api/bots", require("./api/bots"));

const PORT = 5000;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));