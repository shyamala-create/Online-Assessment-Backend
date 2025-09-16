// routes/questionRoutes.ts
import express from "express";
import { createQuestion, getQuestions } from "../controllers/questionController";

const questionRoutes = express.Router();

questionRoutes.post("/", createQuestion);
questionRoutes.get("/", getQuestions);

export default questionRoutes;
