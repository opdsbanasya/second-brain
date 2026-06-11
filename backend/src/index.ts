import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/dbConfig.js';
import dns from "dns";
import { authRoute } from './routes/authRoutes.js';

dns.setServers(["8.8.8.8", "8.8.4.4"]);

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());

app.use("/api/v1/auth", authRoute)
// Default route
app.get("/", (req, res)=>{
    try {
        res.json({message: "Welcome to the Second Brain 🤯"})
    } catch (error) {
        res.status(400).json({message: "Internal Server Error"})
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