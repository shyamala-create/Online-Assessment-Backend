// models/incidentSchema.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IIncident extends Document {
  sessionId: mongoose.Types.ObjectId;  // link to the exam session
  type: string;                         // e.g. "Multiple Faces", "Tab Switch", "Noise Detected"
  description: string;                  // more details
  flaggedAt: Date;
}

const incidentSchema = new Schema<IIncident>({
  sessionId: { type: Schema.Types.ObjectId, ref: "Session", required: true },
  type: { type: String, required: true },
  description: { type: String },
  flaggedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IIncident>("Incident", incidentSchema);
