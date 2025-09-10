import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import userSchema from "../models/userSchema";
import examSchema from "../models/examSchema";

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
      const exam = await examSchema.findByIdAndUpdate(id, req.body, { new: true });

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
};

export default ExamController;
