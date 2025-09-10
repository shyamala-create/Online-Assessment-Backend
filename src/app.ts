import express, { Request, Response } from "express";
import cors from "cors";
import authRouter from "./routes/authRouter";
import cookieParser from "cookie-parser";import examRouter from "./routes/examRouter";
;

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
app.use('/api/exams', examRouter);

export default app;
