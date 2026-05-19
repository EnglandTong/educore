import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

export interface IWrongAnswerDocument {
  _id: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  questionId: string;
  moduleId: string;
  skillId: string;
  studentAnswer: string;
  correctAnswer: string;
  explanation: string;
  reviewStatus: "pending" | "reviewing" | "mastered";
  reviewCount: number;
  lastReviewedAt?: Date;
  nextReviewAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const wrongAnswerSchema = new Schema<IWrongAnswerDocument>(
  {
    studentId: { type: Schema.Types.ObjectId, required: true, index: true, ref: "User" },
    questionId: { type: String, required: true, index: true },
    moduleId: { type: String, required: true, index: true },
    skillId: { type: String, required: true },
    studentAnswer: { type: String, required: true },
    correctAnswer: { type: String, required: true },
    explanation: { type: String, required: true },
    reviewStatus: { type: String, enum: ["pending", "reviewing", "mastered"], default: "pending" },
    reviewCount: { type: Number, default: 0 },
    lastReviewedAt: Date,
    nextReviewAt: Date
  },
  { timestamps: true }
);

wrongAnswerSchema.index({ studentId: 1, reviewStatus: 1, nextReviewAt: 1, createdAt: -1 });

export const WrongAnswer = (models.WrongAnswer ?? model<IWrongAnswerDocument>("WrongAnswer", wrongAnswerSchema)) as mongoose.Model<IWrongAnswerDocument>;
