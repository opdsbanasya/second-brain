import type { Request, Response } from "express";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { APIKey } from "../models/APIKeys.js";

export const createAPIKey = async (req: Request, res: Response) => {
  try {
    // read the api name
    let { name } = req.body;
    // validate and sanitize
    if (!name)
      return res.status(400).json({ message: "API name is required!" });
    name = name.toLowerCase().trim();

    // generate key
    const secret = crypto.randomBytes(32).toString("hex");
    const hashedKey = await bcrypt.hash(secret, 10);
    const shortKey = `${secret.slice(0, 4)}...${secret.slice(-4)}`;

    // create in db
    const apiKey = await APIKey.create({
      name,
      key: hashedKey,
      shortKey,
      user: req.user._id,
    });
    
    // format the key for the user
    const token = `sb_${apiKey._id}_${secret}`;

    // send response
    return res.status(201).json({
      message: "API Key created successfully",
      apiKey: {
        ...apiKey.toJSON(),
        key: token,
      },
    });
  } catch (error) {
    // console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAPIKey = async (req: Request, res: Response) => {
  try {
    // read user
    const userId = req.user?._id;

    // get APIs
    const apiKeys = await APIKey.find({ user: userId }).select("-__v -key");

    // send
    res.json({ message: "API Keys Fetched Successfully!", apiKeys });
  } catch (err) {
    // console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteAPIKey = async (req: Request, res: Response) => {
  try {
    // read the api id
    const { keyId } = req.params;
    const userId = req.user._id;

    if (!keyId) return res.status(400).json({ message: "API ID is required!" });

    // check in db
    const apiKey = await APIKey.findById(keyId);

    // delete
    if (!apiKey) return res.status(404).json({ message: "API Key not found!" });

    // check if owner
    if(userId.toString() !== apiKey.user.toString()) return res.status(401).json({ message: "Unauthorized!" });

    // delete
    await apiKey.deleteOne();

    // send
    return res.json({ message: "API Key deleted successfully"});
  } catch (error) {
    // console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
