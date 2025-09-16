import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import examSchema from "../models/examSchema";
// import Question from "../models/questionSchema"; // ensure this exists
import userSchema from "../models/userSchema";
import mongoose from "mongoose";

// Extend Express Request type to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        // add other properties if needed
      };
    }
  }
}

const ExamController = {
  // Get all exams
  getAllExams: async (req: Request, res: Response) => {
    try {
      const exams = await examSchema.find();
      res.status(200).json(exams);
    } catch (err) {
      res
        .status(400)
        .json({ message: "Unable to fetch the exams", error: err });
    }
  },

  // Create new exam
  createExam: async (req: Request, res: Response) => {
    try {
      const exam = new examSchema(req.body);
      await exam.save();
      res.status(201).json({ message: "Exam created successfully", exam });
    } catch (err) {
      res.status(400).json({ message: "Error creating exam", error: err });
    }
  },

  // Update exam
  updateExam: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const exam = await examSchema.findByIdAndUpdate(id, req.body, {
        new: true,
      });

      if (!exam) {
        return res.status(404).json({ message: "Exam not found" });
      }

      res.status(200).json({ message: "Exam updated successfully", exam });
    } catch (err) {
      res.status(400).json({ message: "Error updating exam", error: err });
    }
  },

  // Delete exam
  deleteExam: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const exam = await examSchema.findByIdAndDelete(id);

      if (!exam) {
        return res.status(404).json({ message: "Exam not found" });
      }

      res.status(200).json({ message: "Exam deleted successfully" });
    } catch (err) {
      res.status(400).json({ message: "Error deleting exam", error: err });
    }
  },

  // Get exam details by ID
  getExamDetails: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      // Validate MongoDB ObjectId
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ message: "Invalid exam ID" });
      }

      // Find exam and populate questions & creator info
      const exam = await examSchema
        .findById(id)
        .populate("questions") // full question objects
        .populate("createdBy", "firstName lastName email"); // admin info

      if (!exam) {
        return res.status(404).json({ message: "Exam not found" });
      }

      // Ensure questions array exists
      const questions =
        exam.questions && exam.questions.length > 0 ? exam.questions : [];

      res.status(200).json({
        _id: exam._id,
        title: exam.title,
        description: exam.description,
        subject: exam.subject,
        date: exam.date,
        duration: exam.duration,
        totalMarks: exam.totalMarks,
        instructions: exam.instructions,
        createdBy: exam.createdBy || null,
        questions,
      });
    } catch (err) {
      console.error("Error fetching exam details:", err);
      res.status(500).json({
        message: "Error fetching exam details",
        error: err instanceof Error ? err.message : err,
      });
    }
  },

  // Enroll exam
  enrollExam: async (req: Request, res: Response) => {
    try {
      const token = req.cookies?.token;
      if (!token) return res.status(401).json({ message: "Unauthorized" });

      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        id: string;
      };

      const student = await userSchema.findById(decoded.id);
      if (!student)
        return res.status(404).json({ message: "Student not found" });

      const { examId } = req.body;

      // Save enrollment
      if (!student.enrolledExams.includes(examId)) {
        student.enrolledExams.push(examId);
        await student.save();
      }

      res.status(200).json({
        message: "Enrolled successfully",
        enrolledExams: student.enrolledExams,
      });
    } catch (err) {
      res.status(500).json({ message: "Error enrolling", error: err });
    }
  },
  // Start exam
  startExam: async (req: Request, res: Response) => {
    try {
      const { examId } = req.params;
      const userId = req.user?.id; // from auth middleware

      const user = await userSchema.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      // Check if already started
      const existingAttempt = user.examAttempts.find(
        (attempt) => attempt.examId.toString() === examId && attempt.inProgress
      );
      if (existingAttempt) return res.status(400).json({ message: "Exam already in progress" });

      // Initialize exam attempt
      user.examAttempts.push({
        examId: new mongoose.Types.ObjectId(examId),
        answers: [],
        score: 0,
        inProgress: true,
        startedAt: new Date(),
      });

      await user.save();
      res.status(200).json({ message: "Exam started successfully" });
    } catch (err) {
      res.status(500).json({ message: "Error starting exam", error: err });
    }
  },

  // Save progress
  saveExamProgress: async (req: Request, res: Response) => {
    try {
      const { examId } = req.params;
      const { answers } = req.body; // [{ questionId, selectedOption }]
      const userId = req.user?.id;

      const user = await userSchema.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      const attempt = user.examAttempts.find(
        (a) => a.examId.toString() === examId && a.inProgress
      );
      if (!attempt) return res.status(404).json({ message: "No in-progress exam found" });

      // Save/update answers
      attempt.answers = answers;
      await user.save();
      res.status(200).json({ message: "Progress saved successfully" });
    } catch (err) {
      res.status(500).json({ message: "Error saving progress", error: err });
    }
  },

  // Submit exam
  submitExam: async (req: Request, res: Response) => {
    try {
      const { examId } = req.params;
      const userId = req.user?.id;

      const user = await userSchema.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      const attempt = user.examAttempts.find(
        (a) => a.examId.toString() === examId && a.inProgress
      );
      if (!attempt) return res.status(404).json({ message: "No in-progress exam found" });

      // TODO: calculate score (compare attempt.answers with exam.questions)
      let score = 0;
      // For example purposes, assume 1 point per correct answer
      const exam = await examSchema.findById(examId).populate({
        path: "questions",
        model: "Question", // Ensure this matches your question model name
        select: "correctOption _id"
      });
      if (!exam) return res.status(404).json({ message: "Exam not found" });

      exam.questions.forEach((q: any) => {
        const userAnswer = attempt.answers.find(
          (a: any) => a.questionId.toString() === q._id.toString()
        );
        if (userAnswer && userAnswer.selectedOption === q.correctOption) score += 1;
      });

      // Mark attempt as submitted
      attempt.score = score;
      attempt.inProgress = false;
      attempt.submittedAt = new Date();

      // Optionally update enrolledExams
      const enrolledExam = user.enrolledExams.find(
        (e) => e.examId.toString() === examId
      );
      if (enrolledExam) {
        enrolledExam.score = score;
        enrolledExam.attemptedAt = new Date();
      } else {
        user.enrolledExams.push({ examId: new mongoose.Types.ObjectId(examId), score, attemptedAt: new Date() });
      }

      await user.save();
      res.status(200).json({ message: "Exam submitted successfully", score });
    } catch (err) {
      res.status(500).json({ message: "Error submitting exam", error: err });
    }
  },

  // Get current exam attempt
  getExamAttempt: async (req: Request, res: Response) => {
    try {
      const { examId } = req.params;
      const userId = req.user?.id;

      const user = await userSchema.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      const attempt = user.examAttempts.find(
        (a) => a.examId.toString() === examId && a.inProgress
      );

      if (!attempt) return res.status(404).json({ message: "No in-progress exam found" });

      res.status(200).json(attempt);
    } catch (err) {
      res.status(500).json({ message: "Error fetching exam attempt", error: err });
    }
  },
};

export default ExamController;
