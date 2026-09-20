import helmet from "helmet";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/dbConfig.js";
import { authRoute } from "./routes/auth.routes.js";
import tagRoute from "./routes/tags.route.js";
import contentRoute from "./routes/content.route.js";
import shareRoute from "./routes/share.routes.js";
import userRoute from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import apiKey from "./routes/apiKeys.route.js";
import cors from "cors";
import { apiLimiter, authLimiter } from "./utils/rateLimiter.js";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(helmet());

app.set("trust proxy", 1);

app.use(cookieParser());
app.use(express.json({limit: "10mb"}));

// Apply rate limiter to all API routes
app.use("/api", apiLimiter);

const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
if(!clientUrl){
  console.error("CLIENT_URL is not defined");
  process.exit(1);
}

app.use(
  cors({
    origin: [clientUrl],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  }),
);

app.use("/api/v1/auth", authLimiter, authRoute);
app.use("/api/v1/content", contentRoute);
app.use("/api/v1/tags", tagRoute);
app.use("/api/v1/shared-links", shareRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/api-key", apiKey);

// Default route
app.get("/", (req, res) => {
  try {
    res.json({ message: "Welcome to the Second Brain dY_" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
