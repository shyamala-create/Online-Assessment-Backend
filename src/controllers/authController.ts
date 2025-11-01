import { Request, Response } from "express";
import userSchema, { IUser } from "../models/userSchema";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const AuthController = {
  // Get all users
  getAllUsers: async (req: Request, res: Response) => {
    try {
      const users = await userSchema.find().select("-password");
      res.status(200).json(users);
    } catch (err) {
      console.error("Get users error:", err);
      res.status(500).json({
        message: "Error fetching user details",
        error: err instanceof Error ? err.message : err,
      });
    }
  },

  // Register user
  registerUser: async (req: Request, res: Response) => {
    try {
      const { firstName, lastName, email, password, role } = req.body;

      if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // check if user exists
      const existingUser = await userSchema.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // create new user
      const newUser = await userSchema.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
      });

      res.status(201).json({
        message: "User registered successfully",
        user: { id: newUser._id, email: newUser.email, role: newUser.role },
      });
    } catch (err) {
      console.error("Register error:", err);
      res.status(500).json({
        message: "Error registering user",
        error: err instanceof Error ? err.message : err,
      });
    }
  },

  //  Login user
  loginUser: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
      }

      const user = await userSchema.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ message: "User not found, please register first" });
      }

      // check password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // generate JWT token
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "7d",
        }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: true, // set true in production (with HTTPS)
        sameSite: "none",
      });

      res.status(200).json({
        message: "Login successful",
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          token: token,
        },
      });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({
        message: "Error logging in user",
        error: err instanceof Error ? err.message : err,
      });
    }
  },

  me: async (req: Request, res: Response) => {
    try {
      const token = req.cookies?.token;

      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }

      // verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        id: string;
      };

      const user = await userSchema.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Return user directly (to match your frontend)
      res.status(200).json({
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Error fetching user info",
        error: err instanceof Error ? err.message : err,
      });
    }
  },
  updateProfile: async (req: Request, res: Response) => {
    try {
      const token = req.cookies?.token;
      if (!token) return res.status(401).json({ message: "Unauthorized" });

      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        id: string;
      };

      const updatedUser = await userSchema
        .findByIdAndUpdate(
          decoded.id,
          {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
          },
          { new: true, runValidators: true }
        )
        .select("-password");

      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json({ message: "Error updating profile", error: err });
    }
  },

  logout: async (req: Request, res: Response) => {
    try {
      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // only HTTPS in prod
        sameSite: "strict",
      });
      return res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
      return res.status(500).json({
        message: "Error logging out",
        error: err instanceof Error ? err.message : err,
      });
    }
  },
};

export default AuthController;
