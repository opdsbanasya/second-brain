import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { createAPIKey, deleteAPIKey, getAPIKey } from "../controllers/apiKeys.controller.js";

const apiKey: Router = Router();

apiKey.use(authMiddleware);
apiKey.post("/", createAPIKey);
apiKey.get("/", getAPIKey);
apiKey.delete("/:keyId", deleteAPIKey);

export default apiKey;