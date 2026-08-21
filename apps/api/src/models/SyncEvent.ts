import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

export interface ISyncEventDocument {
  _id: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  eventId: string;
  operation: "submit_answer" | "end_session";
  status: "processing" | "completed";
  createdAt?: Date;
  updatedAt?: Date;
}

const syncEventSchema = new Schema<ISyncEventDocument>(
  {
    studentId: { type: Schema.Types.ObjectId, required: true, index: true, ref: "User" },
    eventId: { type: String, required: true },
    operation: { type: String, enum: ["submit_answer", "end_session"], required: true },
    status: { type: String, enum: ["processing", "completed"], required: true }
  },
  { timestamps: true }
);

syncEventSchema.index({ studentId: 1, eventId: 1 }, { unique: true });

export const SyncEvent = (models.SyncEvent ?? model<ISyncEventDocument>("SyncEvent", syncEventSchema)) as mongoose.Model<ISyncEventDocument>;
