import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { createShareLink, deleteShareLink, getSharedContent } from '../controllers/share.controller.js';

const shareRoute = express.Router();

shareRoute.post("/", authMiddleware, createShareLink)
shareRoute.get("/:id", authMiddleware, getSharedContent)
shareRoute.delete("/:id", authMiddleware, deleteShareLink)

export default shareRoute;