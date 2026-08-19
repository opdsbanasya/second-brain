import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import Tags from "../models/Tags.js";
import { sanitizeSearchQuery } from "../middlewares/searchQuery.js";

const tagRoute: express.Router = express.Router();

tagRoute.use(authMiddleware);

tagRoute.get("/", sanitizeSearchQuery, async (req, res) => {
  try {
    const query = req?.rawQuery || "";

    const tags = await Tags.find({
      name: {
        $regex: query || "",
        $options: "i",
      },
    })
      .sort({ name: 1 })
      .limit(10);

    res.json({ tags });
  } catch (error) {
    console.error("Error fetching tags:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default tagRoute;
