require("dotenv").config();
const Users = require("../database/models/User");
const jwt = require("jsonwebtoken");

const jwtAuth = async (req, res, next) => {
    const jwtHeader = req.headers["authorization"];
    const token = jwtHeader && jwtHeader.split(" ")[1];

    if (!token) return res.status(400).json({ message: "Please provide a token.", error: "Bad Request." });

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedData) return res.status(403).json({ message: "The token is invalid." });
    const { id } = decodedData.user;
    const foundUser = await Users.findOne({ id });
    if (token !== foundUser.token) return res.status(401).json({ message: "The token is invalid.", error: "Unauthorized" });
    console.log("nest");
    next();
};

module.exports = jwtAuth;
