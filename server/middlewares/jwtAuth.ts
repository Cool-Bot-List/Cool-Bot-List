import dotenv from "dotenv";
dotenv.config();
import { Response, Request, NextFunction } from "express";
import Users from "../database/models/User";
import jwt from "jsonwebtoken";

const jwtAuth = async (req: Request, res: Response, next: NextFunction) => {
    const jwtHeader = req.headers["authorization"];
    const token = jwtHeader && jwtHeader.split(" ")[1];

    if (!token) return res.status(400).json({ message: "Please provide a token.", error: "Bad Request." });

    const decodedData = <{ user: { id: string } }>jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedData) return res.status(403).json({ message: "The token is invalid." });

    const { id } = decodedData.user;
    const foundUser = await Users.findOne({ id });
    if (token !== foundUser!.token) return res.status(401).json({ message: "The token is invalid.", error: "Unauthorized" });
    next();
};

export default jwtAuth;
