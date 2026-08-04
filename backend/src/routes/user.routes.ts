import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { updateUser, getUser } from "../controllers/user.controller.js";

const router: express.Router = express.Router();

router.use(authMiddleware);

router.put("/me", updateUser);
router.get("/me", getUser);

export default router;
