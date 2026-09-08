import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  createContent,
  deleteContentById,
  getAllContents,
  getContentById,
  searchContent,
  updateContentById,
  exportContentToPdf,
} from "../controllers/content.controller.js";
import { sanitizeSearchQuery } from "../middlewares/searchQuery.js";

import { contentvalidator } from "../middlewares/contentValidator.js";

const contentRoute: express.Router = express.Router();

contentRoute.use(authMiddleware);

contentRoute.post("/", contentvalidator, createContent);
contentRoute.get("/export-pdf", exportContentToPdf);
contentRoute.post("/export-pdf", exportContentToPdf);
contentRoute.get("/", getAllContents);
contentRoute.get("/search", sanitizeSearchQuery, searchContent);
contentRoute.get("/:id", getContentById);
contentRoute.put("/:id", contentvalidator, updateContentById);
contentRoute.delete("/:id", deleteContentById);

export default contentRoute;
