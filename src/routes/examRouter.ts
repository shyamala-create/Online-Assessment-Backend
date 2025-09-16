import express from "express";
import authMiddleware from "../middleware/authMiddleware";
import examController from "../controllers/examController";

const examRouter = express.Router();

// Students & Admin can view exams
examRouter.get("/", authMiddleware.isAuthenticated, examController.getAllExams);
examRouter.get(
  "/:id",
  authMiddleware.isAuthenticated,
  examController.getExamDetails
);

//only student can enroll exam
examRouter.post(
  "/enroll",
  authMiddleware.isAuthenticated,
  authMiddleware.authorizeRoles("student"),
  examController.enrollExam
);

// Only Admin can manage exams
examRouter.post(
  "/",
  authMiddleware.isAuthenticated,
  authMiddleware.authorizeRoles("admin"),
  examController.createExam
);
examRouter.put(
  "/update/:id",
  authMiddleware.isAuthenticated,
  authMiddleware.authorizeRoles("admin"),
  examController.updateExam
);
examRouter.delete(
  "/delete/:id",
  authMiddleware.isAuthenticated,
  authMiddleware.authorizeRoles("admin"),
  examController.deleteExam
);

// Student exam routes
examRouter.post(
  "/start/:examId",
  authMiddleware.isAuthenticated,
  authMiddleware.authorizeRoles("student"),
  examController.startExam
);

examRouter.put(
  "/save/:examId",
  authMiddleware.isAuthenticated,
  authMiddleware.authorizeRoles("student"),
  examController.saveExamProgress
);

examRouter.post(
  "/submit/:examId",
  authMiddleware.isAuthenticated,
  authMiddleware.authorizeRoles("student"),
  examController.submitExam
);

examRouter.get(
  "/attempt/:examId",
  authMiddleware.isAuthenticated,
  authMiddleware.authorizeRoles("student"),
  examController.getExamAttempt
);
export default examRouter;
