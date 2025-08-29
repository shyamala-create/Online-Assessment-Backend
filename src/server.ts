import dotenv from "dotenv";
import connectDB from "./config/db";
import app from "./app";
import env from "./config/environment";

// Load env variables
dotenv.config();

// Connect to DB
connectDB().then(() => {
  console.log("MongoDB connected establised");
  app.listen(env.PORT, () => {
  console.log(`Server running on http://localhost:${env.PORT}`);
});
}).catch((err) => {
  console.error("Error connecting to database")
})

