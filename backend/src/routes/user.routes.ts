import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { updateUser, getUser } from "../controllers/user.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.put("/update", updateUser);
router.get("/me", getUser);

export default router;