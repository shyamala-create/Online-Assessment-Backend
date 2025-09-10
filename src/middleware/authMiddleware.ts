import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import userSchema from "../models/userSchema";

const authMiddleware = {
  // Verify token from cookies
  isAuthenticated: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies?.token; // only from cookies

      if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

      // Find user
      const user = await userSchema.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(401).json({ message: "Unauthorized: User not found" });
      }

      // Attach user to request
      (req as any).user = user;
      next();
    } catch (err) {
      return res.status(401).json({ message: "Unauthorized or invalid token", error: err });
    }
  },

  // Role-based access
  authorizeRoles: (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const user = (req as any).user;
      if (!user || !roles.includes(user.role)) {
        return res.status(403).json({ message: "Forbidden: Access denied" });
      }
      next();
    };
  },
};

export default authMiddleware;
