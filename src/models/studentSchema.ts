import mongoose, { Schema, Document } from "mongoose";

export interface IStudent extends Document {
  name: string;
  status: "Active" | "Inactive" | "Disconnected";
  activity: string;
  flaggedIncidents: string[];
}

const StudentSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Disconnected"],
      required: true,
    },
    activity: { type: String, required: true },
    flaggedIncidents: { type: [String], default: [] },
  },
  { timestamps: true }
);

StudentSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
  },
})

export default mongoose.model<IStudent>("Student", StudentSchema);
