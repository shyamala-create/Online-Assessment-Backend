import mongoose from "mongoose";
import env from "./environment";

const connectDB = async () => {
  await mongoose.connect(env.MONGO_URI as string);
};

export default connectDB;
