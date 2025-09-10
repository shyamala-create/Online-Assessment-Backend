import express from "express";
import authMiddleware from "../middleware/authMiddleware";
import examController from "../controllers/examController";

const examRouter = express.Router();

// Students & Admin can view exams
examRouter.get("/", authMiddleware.isAuthenticated, examController.getAllExams )

//only student can enroll exam
examRouter.post("/api/exams/enroll", authMiddleware.isAuthenticated, authMiddleware.authorizeRoles("student"), examController.enrollExam);

// Only Admin can manage exams
examRouter.post("/", authMiddleware.isAuthenticated, authMiddleware.authorizeRoles("admin"),examController.createExam);
examRouter.put("/update/:id",authMiddleware.isAuthenticated, authMiddleware.authorizeRoles("admin"), examController.updateExam )
examRouter.delete("/delete/:id", authMiddleware.isAuthenticated, authMiddleware.authorizeRoles("admin"),examController.deleteExam )


export default examRouter;