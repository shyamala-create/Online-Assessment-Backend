import express, { Request, Response } from "express";
import cors from "cors";
import User from "./models/userSchema";

const app = express();

//middleware
app.use(cors());
app.use(express.json());

// Routes
// app.get("/", (req: Request, res: Response) => {
//   res.send("Server is running 🚀 with MongoDB connected");
// });

app.post("/users", async (req: Request, res: Response) => {
  const user = new User({
    firstName: "Shyamala",
    lastName: "M S",
    email: "shyamala@96",
  });

  try {
    await user.save();
    res.status(200).send("User data saved successfully");
  } catch (err) {
    res.status(500).send("Unable to save user data");
  }
});

export default app;
