import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import Tags from "../models/Tags.js";

const tagRoute = express.Router();

tagRoute.use(authMiddleware);

tagRoute.get("/", (req, res) => {
  try {
    const query = req.query.q as string | "a";

    const tags = Tags.find({
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
