import mongoose, { Schema, Document } from "mongoose";

export interface IExam extends Document {
  title: string;
  description: string;
  subject: string;
  date: Date;
  duration: number; // in minutes
  totalMarks: number;
  instructions: string;
  createdBy: mongoose.Types.ObjectId; // reference to Admin
  questions: mongoose.Types.ObjectId[]; // reference to Question Bank
}

const examSchema: Schema<IExam> = new Schema<IExam>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    subject: { type: String, required: true },
    date: { type: Date, required: true },
    duration: { type: Number, required: true }, // e.g. 90 minutes
    totalMarks: { type: Number, required: true },
    instructions: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    questions: [{ type: Schema.Types.ObjectId, ref: "Question" }],
  },
  {
    timestamps: true,
  }
);

const Exam = mongoose.model<IExam>("Exam", examSchema);

export default Exam;
