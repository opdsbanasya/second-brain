import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  SECOND_BRAIN_API_URL: z.string().url(),
  SECOND_BRAIN_API_KEY: z.string().min(1),
});

export const env = schema.parse(process.env);