import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { createShareLink } from '../controllers/share.controller.js';

const shareRoute = express.Router();

shareRoute.post("/", authMiddleware, createShareLink)

export default shareRoute;