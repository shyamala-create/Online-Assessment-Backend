import mongoose, { Schema, Document } from "mongoose";

export interface IQuestion extends Document {
  questionText: string;
  options: string[];
  correctAnswer: string;
  marks: number;
  type: string;
  topic: string;
  category: string;
  difficulty: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const questionSchema: Schema<IQuestion> = new Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
  marks: { type: Number, required: true },
  type: { type: String, required: true },
  topic: {type: String, required: true },
  category: { type: String, required: true },
  difficulty: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true
});

const Question = mongoose.model<IQuestion>("Question", questionSchema);

export default Question;
