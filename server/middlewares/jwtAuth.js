require("dotenv").config();
const jwt = require("jsonwebtoken");

const jwtAuth = (req, res, next) => {
    const jwtHeader = req.headers["authorization"];
    const token = jwtHeader && jwtHeader.split(" ")[1];

    if (!token) return res.status(403).json({ message: "Please provide a token." });

    try {
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);

        decodedData ? next() : res.status(403).json({ message: "The token is invalid." });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong while validating the token." });
    }
};

module.exports = jwtAuth;
