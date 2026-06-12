import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { createContent, deleteContentById, getAllContents, getContentById, updateContentById } from "../controllers/content.controller.js";

const contentRoute = express.Router();

contentRoute.use(authMiddleware);

contentRoute.post("/", createContent);
contentRoute.get("/", getAllContents);
contentRoute.get("/:id", getContentById);
contentRoute.put("/:id", updateContentById);
contentRoute.delete("/:id", deleteContentById);

export default contentRoute;
