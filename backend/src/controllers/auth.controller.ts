import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import type { UserInputLogin, UserInputRegister } from "../types/User.js";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const userBody: UserInputRegister = req.body;
    console.log(userBody);

    const hashedPassword = await bcrypt.hash(userBody.password, 10);
    userBody.password = hashedPassword;

    const user = await User.create(userBody);

    const { password: _, ...userWithoutPassword } = user.toObject();

    res.status(201).json({ message: "User created successfully", user: userWithoutPassword });
  } catch (error) {
    res.status(400).json({ message: "Bad Request" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password }: UserInputLogin = req.body;

    // Find the user by email
    const user = await User.findOne({ email: email });
    console.log({ user });

    if (!user) {
      return res.status(404).json({ message: "Invalid credentials" });
    }

    // Match the password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user?.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create JWT token and set it to cookie
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
    const token = jwt.sign({ _id: user._id, email: user.email }, secretKey, {
      expiresIn: "2d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
    });
    const { password: _, ...userWithoutPassword } = user.toObject();
    // Send response with user data
    res.status(200).json({ message: "Login successful", user: userWithoutPassword });
  } catch (error) {
    res.status(400).json({ message: "Bad Request" });
  }
};

export const logoutUser = (req: Request, res: Response ) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(400).json({ message: "Bad Request" });
  }
};
