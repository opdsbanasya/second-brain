import express from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/auth.controller.js";

import { userValidator } from "../middlewares/userValidator.js";

export const authRoute: express.Router = express.Router();

authRoute.post("/register", userValidator, registerUser);

authRoute.post("/login", userValidator, loginUser);

authRoute.post("/logout", logoutUser);
