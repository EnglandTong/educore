import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

export interface ISkillMasteryDocument {
  _id: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  moduleId: string;
  skillId: string;
  skillName: string;
  score: number;
  level: string;
  bktParams: {
    pKnown: number;
    pLearn: number;
    pSlip: number;
    pGuess: number;
  };
  streak: {
    current: number;
    best: number;
  };
  totalAttempts: number;
  correctAttempts: number;
  recentAnswers: boolean[];
  lastPracticedAt?: Date;
  nextReviewAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const skillMasterySchema = new Schema<ISkillMasteryDocument>(
  {
    studentId: { type: Schema.Types.ObjectId, required: true, index: true, ref: "User" },
    moduleId: { type: String, required: true },
    skillId: { type: String, required: true },
    skillName: { type: String, required: true },
    score: { type: Number, default: 0 },
    level: { type: String, default: "seedling" },
    bktParams: {
      pKnown: { type: Number, default: 0.2 },
      pLearn: { type: Number, default: 0.1 },
      pSlip: { type: Number, default: 0.1 },
      pGuess: { type: Number, default: 0.25 }
    },
    streak: {
      current: { type: Number, default: 0 },
      best: { type: Number, default: 0 }
    },
    totalAttempts: { type: Number, default: 0 },
    correctAttempts: { type: Number, default: 0 },
    recentAnswers: [Boolean],
    lastPracticedAt: Date,
    nextReviewAt: Date
  },
  { timestamps: true }
);

skillMasterySchema.index({ studentId: 1, moduleId: 1, skillId: 1 }, { unique: true });

export const SkillMastery = (models.SkillMastery ?? model<ISkillMasteryDocument>("SkillMastery", skillMasterySchema)) as mongoose.Model<ISkillMasteryDocument>;
