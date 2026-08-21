import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

export interface IAnswerEventDocument {
  _id: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  eventId: string;
  sessionId: string;
  questionId: string;
  status: "processing" | "completed";
  result?: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
}

const answerEventSchema = new Schema<IAnswerEventDocument>(
  {
    studentId: { type: Schema.Types.ObjectId, required: true, index: true, ref: "User" },
    eventId: { type: String, required: true },
    sessionId: { type: String, required: true },
    questionId: { type: String, required: true },
    status: { type: String, enum: ["processing", "completed"], required: true },
    result: { type: Schema.Types.Mixed }
  },
  { timestamps: true }
);

answerEventSchema.index({ studentId: 1, eventId: 1 }, { unique: true });

export const AnswerEvent = (models.AnswerEvent ?? model<IAnswerEventDocument>("AnswerEvent", answerEventSchema)) as mongoose.Model<IAnswerEventDocument>;
