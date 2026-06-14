import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { createShareLink, deleteShareLink, getSharedContent } from '../controllers/share.controller.js';

const shareRoute = express.Router();

shareRoute.use(authMiddleware);

shareRoute.post("/", createShareLink)
shareRoute.get("/:id", getSharedContent)
shareRoute.delete("/:id", deleteShareLink)

export default shareRoute;