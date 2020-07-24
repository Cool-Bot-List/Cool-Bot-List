const express = require("express");
const app = express();
require("./database/database");
require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.json(), express.urlencoded({ extended: true }));

app.use("/api/bots", require("./api/bots"));
app.use("/api/users", require("./api/users"));
app.use("/api/bots/reviews", require("./api/reviews"));
app.use("/api/bots/reviews/owner-review", require("./api/ownerReply"));

//semi colons smh
const PORT = 5000;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
