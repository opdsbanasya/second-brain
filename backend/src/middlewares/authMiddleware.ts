import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import { APIKey } from "../models/APIKeys.js";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // 1. Check for API Key first (for MCP Server / programmatic access)
    const apiKeyHeader = req.header("x-api-key");
    if (apiKeyHeader) {
      if (apiKeyHeader.startsWith("sb_")) {
        const parts = apiKeyHeader.split("_");
        if (parts.length === 3) {
          const keyId = parts[1] as string;
          const rawSecret = parts[2] as string;

          const apiKeyDoc = await APIKey.findById(keyId).populate("user");
          if (apiKeyDoc && apiKeyDoc.user) {
            const isMatch = await bcrypt.compare(rawSecret, apiKeyDoc.key);
            if (isMatch) {
              req.user = apiKeyDoc.user;
              return next();
            }
          }
        }
      }
      return res.status(401).json({ message: "Invalid API Key" });
    }

    // 2. Fall back to standard JWT session authentication
    const authorization = req.header("Authorization");
    const bearerToken = authorization?.startsWith("Bearer ")
      ? authorization.slice(7)
      : undefined;
    const token = req.cookies.token || bearerToken;
    // Check if the token exists
    if (!token) {
      return res.status(401).json({ message: "Unauthorized!" });
    }

    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      return res.status(500).json({ message: "Internal Server Error" });
    }

    // decode message
    const decodeToken = jwt.verify(token, secretKey);

    // check if id is not exist
    const userId =
      decodeToken && typeof decodeToken === "object" ? decodeToken._id : null;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // check if user exist in database
    const user = await User.findById(userId);
    if (!user) {
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
