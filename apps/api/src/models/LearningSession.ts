import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

export interface ISessionQuestion {
  questionId: string;
  answered: boolean;
  studentAnswer?: string;
  isCorrect?: boolean;
  timeSpent?: number;
  hintsUsed?: number;
}

export interface ILearningSessionDocument {
  _id: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  moduleId: string;
  type: "diagnostic" | "training" | "review" | "challenge";
  status: "active" | "completed" | "abandoned";
  config: {
    totalQuestions: number;
    currentRound?: number;
    totalRounds?: number;
  };
  questions: ISessionQuestion[];
  stats: {
    correctCount: number;
    totalAnswered: number;
    averageTime: number;
  };
  startedAt: Date;
  completedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const learningSessionSchema = new Schema<ILearningSessionDocument>(
  {
    studentId: { type: Schema.Types.ObjectId, required: true, index: true, ref: "User" },
    moduleId: { type: String, required: true, index: true },
    type: { type: String, enum: ["diagnostic", "training", "review", "challenge"], required: true },
    status: { type: String, enum: ["active", "completed", "abandoned"], default: "active" },
    config: {
      totalQuestions: { type: Number, required: true },
      currentRound: Number,
      totalRounds: Number
    },
    questions: [
      {
        questionId: { type: String, required: true },
        answered: { type: Boolean, default: false },
        studentAnswer: String,
        isCorrect: Boolean,
        timeSpent: Number,
        hintsUsed: Number
      }
    ],
    stats: {
      correctCount: { type: Number, default: 0 },
      totalAnswered: { type: Number, default: 0 },
      averageTime: { type: Number, default: 0 }
    },
    startedAt: { type: Date, default: Date.now },
    completedAt: Date
  },
  { timestamps: true }
);

learningSessionSchema.index({ studentId: 1, type: 1, status: 1, createdAt: -1 });

export const LearningSession = (models.LearningSession ?? model<ILearningSessionDocument>("LearningSession", learningSessionSchema)) as mongoose.Model<ILearningSessionDocument>;
