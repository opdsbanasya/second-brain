import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { createShareLink, deleteShareLink, getSharedContent, getSharedLinks, updateShareLink } from '../controllers/share.controller.js';

const shareRoute: express.Router = express.Router();

shareRoute.get("/public/:id", getSharedContent);
shareRoute.use(authMiddleware);
shareRoute.get("/", getSharedLinks);
shareRoute.post("/", createShareLink);
shareRoute.patch("/:id", updateShareLink);
shareRoute.delete("/:id", deleteShareLink);

export default shareRoute;
