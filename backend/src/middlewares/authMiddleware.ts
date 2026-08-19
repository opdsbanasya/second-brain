import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { APIKey } from "../models/APIKeys.js";

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Check for API Key first (for MCP Server / programmatic access)
    const apiKeyHeader = req.header("x-api-key");
    if (apiKeyHeader) {
      const apiKeyDoc = await APIKey.findOne({ key: apiKeyHeader }).populate("user");
      if (!apiKeyDoc || !apiKeyDoc.user) {
        return res.status(401).json({ message: "Invalid API Key" });
      }
      // Populate replaces the Object ID with the actual User document
      req.user = apiKeyDoc.user;
      return next();
    }

    // 2. Fall back to standard JWT session authentication
    const authorization = req.header("Authorization");
    const bearerToken = authorization?.startsWith("Bearer ")
      ? authorization.slice(7)
      : undefined;
    const token = req.cookies.token || bearerToken;
  console.log("Cookies:", req.cookies);
  console.log("Headers Cookie:", req.headers.cookie);
    // Check if the token exists
    if(!token) {
        return res.status(401).json({ message: "Unauthorized!" });
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
    
    // check if user exist in database
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
