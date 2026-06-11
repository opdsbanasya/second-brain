import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_CONNECTION_STRING;

const connectDB = async () => {
  // check either the URI exist ot not otherwise TSC complains about it
  if (!MONGODB_URI) throw new Error("Database connection string not defined");

  await mongoose.connect(MONGODB_URI);
  console.log("✅ Database connected ");
};

export default connectDB;
