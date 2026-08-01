import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/dbConfig.js';
import { authRoute } from './routes/auth.routes.js';
import tagRoute from './routes/tags.route.js';
import contentRoute from './routes/content.route.js';
import shareRoute from './routes/share.routes.js';
import userRoute from './routes/user.routes.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use((req, res, next) => {
    const origin = process.env.CLIENT_URL || "http://localhost:5173";
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    if (req.method === "OPTIONS") return res.sendStatus(204);
    next();
});

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/content", contentRoute);
app.use("/api/v1/notes", contentRoute); // Backwards-compatible alias.
app.use("/api/v1/tags", tagRoute);
app.use("/api/v1/shared-links", shareRoute);
app.use("/api/v1/users", userRoute);

// Default route
app.get("/", (req, res) => {
    try {
        res.json({ message: "Welcome to the Second Brain 🤯" })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }
})

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
