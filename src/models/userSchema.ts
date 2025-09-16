import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "admin" | "candidate" | "student";
  enrolledExams: {
    examId: mongoose.Types.ObjectId;
    score: number;
    attemptedAt: Date;
  }[];
  examAttempts: {
    examId: mongoose.Types.ObjectId;
    answers: {
      questionId: mongoose.Types.ObjectId;
      selectedOption: string;
    }[];
    score: number;
    inProgress: boolean;
    startedAt: Date;
    submittedAt?: Date;
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
      enum: ["admin", "candidate", "student", "proctor"],
      required: true,
    },
    enrolledExams: [
      {
        examId: { type: Schema.Types.ObjectId, ref: "Exam" },
        score: { type: Number },
        attemptedAt: { type: Date, default: Date.now },
      },
    ],
    examAttempts: [
      {
        examId: { type: Schema.Types.ObjectId, ref: "Exam", required: true },
        answers: [
          {
            questionId: { type: Schema.Types.ObjectId, ref: "Question", required: true },
            selectedOption: { type: String, required: true },
          },
        ],
        score: { type: Number, default: 0 },
        inProgress: { type: Boolean, default: true },
        startedAt: { type: Date, default: Date.now },
        submittedAt: { type: Date },
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
