const express = require("express");
const app = express();
require("./database/database");

<<<<<<< HEAD
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.json(), express.urlencoded({ extended: true }));

app.use("/api/bots", require("./api/bots"));
app.use("/api/bots", require("./api/reviews"));

=======

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.json(), express.urlencoded({ extended: true }));

app.use("/api/bots", require("./api/bots"));
app.use("/api/users", require("./api/users"));
//semi colons smh
>>>>>>> 96e090e348913c9059129ab3d3e2c61623390c52
const PORT = 5000;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));