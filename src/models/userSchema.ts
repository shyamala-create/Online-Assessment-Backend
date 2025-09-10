import mongoose, { Document, Schema } from "mongoose";
import { ValidationError } from "express-validator";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "admin" | "candidate";
  enrolledExams: {
    examId: mongoose.Types.ObjectId;
    score: number;
    attemptedAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema: Schema<IUser> = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["admin", "candidate", "student"],
    },
    enrolledExams: [
      {
        examId: {
          type: Schema.Types.ObjectId,
          ref: "Exam",
        },
        score: {
          type: Number,
        },
        attemptedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
