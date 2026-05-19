import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

export interface IQuestionDocument {
  _id: string;
  moduleId: string;
  skill: string;
  subSkill?: string;
  level: string;
  questionType: string;
  difficulty: number;
  prompt: string;
  choices?: Array<{ key?: string; text?: string }>;
  answerKey: string | string[] | number;
  explanation: string;
  explanationSteps?: string[];
  hints?: string[];
  wrongChoiceReasons?: Record<string, string>;
  tags?: string[];
  estimatedTimeSec?: number;
  stats?: {
    totalAttempts: number;
    correctCount: number;
    avgTimeSec: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const questionSchema = new Schema<IQuestionDocument>(
  {
    _id: { type: String, required: true },
    moduleId: { type: String, required: true, index: true },
    skill: { type: String, required: true, index: true },
    subSkill: String,
    level: { type: String, required: true, index: true },
    questionType: { type: String, required: true },
    difficulty: { type: Number, required: true },
    prompt: { type: String, required: true },
    choices: [{ key: String, text: String }],
    answerKey: { type: Schema.Types.Mixed, required: true },
    explanation: { type: String, required: true },
    explanationSteps: [String],
    hints: [String],
    wrongChoiceReasons: { type: Map, of: String },
    tags: [String],
    estimatedTimeSec: Number,
    stats: {
      totalAttempts: { type: Number, default: 0 },
      correctCount: { type: Number, default: 0 },
      avgTimeSec: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
);

questionSchema.index({ moduleId: 1, skill: 1, level: 1, difficulty: 1 });

export const Question = (models.Question ?? model<IQuestionDocument>("Question", questionSchema)) as mongoose.Model<IQuestionDocument>;
