import { Request, Response, NextFunction } from "express";
import userSchema from "../models/userSchema";

const authMiddleware = {
  isAuthenticated: (req: Request, res: Response, next: NextFunction) => {
    const token = req.body;

    if(!token){
        res.status(401).json("Invalid token")
    } else {
        next();
    }
  },
};

const userAuth = (req: Request, res: Response, next: NextFunction) => {
    
}

export default authMiddleware;
