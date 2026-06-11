import express from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/auth.controller.js";

export const authRoute = express.Router();

authRoute.post("/register", registerUser);

authRoute.post("/login", loginUser);

authRoute.post("/logout", logoutUser);
