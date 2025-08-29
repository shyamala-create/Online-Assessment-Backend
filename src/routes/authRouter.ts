import express from "express";
import AuthController from "../controllers/authController";
import authMiddleware from "../middleware/authMiddleware";

const authRouter = express.Router();

authRouter.get("/register", AuthController.getAllUsers);
authRouter.get("/login",  AuthController.loginUser)
authRouter.get("/users", authMiddleware.isAuthenticated, AuthController.getAllUsers)

export default authRouter;
