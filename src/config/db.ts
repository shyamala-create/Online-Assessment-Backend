import mongoose from "mongoose";
import env from "./environment";

const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGO_URI as string);
    console.log("✅ Database connected successfully");
  } catch (err) {
    if (err instanceof Error) {
      console.error("❌ Database connection error:", err.message);
    } else {
      console.error("❌ Database connection error:", err);
    }
    process.exit(1);
  }
};

export default connectDB;
