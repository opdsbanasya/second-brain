import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.cookies;

    // Check if the token exists
    if(!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const secretKey = process.env.JWT_SECRET;
    if(!secretKey) {
        return res.status(500).json({ message: "Internal Server Error" });
    }

    // decode message
    const decodeToken = jwt.verify(token, secretKey);

    // check if id is not exist
    const userId = decodeToken && typeof decodeToken === "object" ? decodeToken._id : null;
    if(!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    // chack if user exist in database
    const user = await User.findById(userId);
    if(!user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    // add user to req object
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default authMiddleware;