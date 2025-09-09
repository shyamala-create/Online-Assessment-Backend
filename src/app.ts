import express, { Request, Response } from "express";
import cors from "cors";
import authRouter from "./routes/authRouter";
import cookieParser from "cookie-parser";;

const app = express();

//middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser())

app.use('/', authRouter);
// Routes
// app.get("/", (req: Request, res: Response) => {
//   res.send("Server is running 🚀 with MongoDB connected");
// });

// app.post("/users", async (req: Request, res: Response) => {
//   const user = new User({
//     firstName: "Shyamala",
//     lastName: "M S",
//     email: "shyamala@96",
//   });

//   try {
//     await user.save();
//     res.status(200).send("User data saved successfully");
//   } catch (err) {
//     res.status(500).send("Unable to save user data");
//   }
// });

export default app;
