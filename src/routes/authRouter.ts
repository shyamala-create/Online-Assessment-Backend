import express from "express";
import AuthController from "../controllers/authController";
import authMiddleware from "../middleware/authMiddleware";

const authRouter = express.Router();

authRouter.post("/api/auth/register", AuthController.registerUser);
authRouter.post("/api/auth/login",  AuthController.loginUser)
authRouter.get("/api/auth/me",  AuthController.me)
authRouter.put("/api/student/profile",  AuthController.updateProfile)
authRouter.post("/api/auth/logout", AuthController.logout);
authRouter.get("/users", authMiddleware.isAuthenticated, AuthController.getAllUsers)

export default authRouter;
