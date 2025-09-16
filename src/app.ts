import express, { Request, Response } from "express";
import cors from "cors";
import authRouter from "./routes/authRouter";
import cookieParser from "cookie-parser";
import examRouter from "./routes/examRouter";
// importing models to ensure Mongoose registers them
import "./models/questionSchema";
import "./models/examSchema";
import "./models/userSchema";
import questionRoutes from "./routes/questionRoutes";
import incidentRouter from "./routes/incidentRoute";
import monitoringRoutes from "./routes/monitoringRoute";

const app = express();

//middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/api/exams", examRouter);
app.use("/api/questions", questionRoutes);
app.use("/api/incidents", incidentRouter);
app.use("/api/monitoring", monitoringRoutes);

export default app;
