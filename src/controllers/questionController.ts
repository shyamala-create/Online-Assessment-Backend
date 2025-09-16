// controllers/questionController.ts
import { Request, Response } from "express";
import Question from "../models/questionSchema";

export const createQuestion = async (req: Request, res: Response) => {
  try {
    const question = new Question(req.body);
    await question.save();
    res.status(201).json({ message: "Question created", question });
  } catch (err: any) {
    res.status(500).json({ message: "Error creating question", error: err.message });
  }
};

export const getQuestions = async (req: Request, res: Response) => {
  try {
    const filters = req.query; // { topic: "Math", difficulty: "EASY" }
    const questions = await Question.find(filters);
    res.json(questions);
  } catch (err: any) {
    res.status(500).json({ message: "Error fetching questions", error: err.message });
  }
};
