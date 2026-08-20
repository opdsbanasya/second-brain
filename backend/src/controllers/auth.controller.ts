import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import type { UserInputLogin, UserInputRegister } from "../types/User.js";
import { isStrongPassword, isValidEmail } from "../utils/validation.js";

const setSessionCookie = (
  res: Response,
  user: { _id: unknown; email: string },
) => {
  const secretKey = process.env.JWT_SECRET;
  if (!secretKey) throw new Error("JWT_SECRET is not configured");

  const expiresIn = process.env.JWT_EXPIRES_IN;

  if(!expiresIn) return res.status(500).json({message: "internal server error"})

  const token = jwt.sign({ _id: user._id, email: user.email }, secretKey, {
    expiresIn: Number(expiresIn),
  });
  
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "local",
    sameSite: process.env.NODE_ENV !== "local" ? "none" : "strict",
    maxAge: Number(expiresIn),
  });
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const userBody: UserInputRegister = req.body;

    if (!isValidEmail(userBody.email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!isStrongPassword(userBody.password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
      });
    }

    const hashedPassword = await bcrypt.hash(userBody.password, 10);
    userBody.password = hashedPassword;

    const user = await User.create({
      ...userBody,
      email: userBody.email.toLowerCase(),
    });

    const { password: _, ...userWithoutPassword } = user.toObject();
    setSessionCookie(res, user);

    res
      .status(201)
      .json({
        message: "User created successfully",
        user: userWithoutPassword,
      });
  } catch (error) {
    res.status(400).json({ message: "Bad Request" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password }: UserInputLogin = req.body;

    // Find the user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ message: "Invalid credentials" });
    }

    // Match the password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user?.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create JWT token and set it to cookie
    setSessionCookie(res, user);
    const { password: _, ...userWithoutPassword } = user.toObject();
    // Send response with user data
    res
      .status(200)
      .json({ message: "Login successful", user: userWithoutPassword });
  } catch (error) {
    res.status(400).json({ message: "Bad Request" });
  }
};

export const logoutUser = (req: Request, res: Response) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: process.env.NODE_ENV !== "local" ? "none" : "strict",
      secure: process.env.NODE_ENV !== "local",
    });
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(400).json({ message: "Bad Request" });
  }
};
