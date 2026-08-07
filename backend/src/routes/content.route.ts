import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { createContent, deleteContentById, getAllContents, getContentById, searchContent, updateContentById } from "../controllers/content.controller.js";

const contentRoute: express.Router = express.Router();

contentRoute.use(authMiddleware);

contentRoute.post("/", createContent);
contentRoute.get("/", getAllContents);
contentRoute.get("/search", searchContent);
contentRoute.get("/:id", getContentById);
contentRoute.put("/:id", updateContentById);
contentRoute.delete("/:id", deleteContentById);

export default contentRoute;
