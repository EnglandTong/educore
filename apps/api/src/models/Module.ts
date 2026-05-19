import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

export interface ISkillConfig {
  id: string;
  name: string;
  description: string;
  subSkills: Array<{ id: string; name: string; description?: string }>;
  order: number;
}

export interface ILevelConfig {
  id: string;
  name: string;
  gradeRange: string;
  order: number;
}

export interface IDiagnosticConfig {
  rounds: number;
  questionsPerRound: number;
  strategy: "adaptive" | "fixed" | "random";
}

export interface ITrainingConfig {
  sessionLength: number;
  adaptiveWeights: { weak: number; current: number; review: number };
  masteryThreshold: number;
}

export interface IModuleDocument {
  _id: string;
  name: string;
  version: string;
  subject: string;
  category: string;
  description: string;
  icon: string;
  color: string;
  targetAge?: { min?: number; max?: number };
  skills?: ISkillConfig[];
  levels?: ILevelConfig[];
  diagnostic?: IDiagnosticConfig;
  training?: ITrainingConfig;
  createdAt?: Date;
  updatedAt?: Date;
}

const moduleSchema = new Schema<IModuleDocument>(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    version: { type: String, required: true },
    subject: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true },
    color: { type: String, required: true },
    targetAge: { min: Number, max: Number },
    skills: { type: Array, default: [] },
    levels: { type: Array, default: [] },
    diagnostic: { type: Object, default: {} },
    training: { type: Object, default: {} }
  },
  { timestamps: true }
);

export const Module = (models.Module ?? model<IModuleDocument>("Module", moduleSchema)) as mongoose.Model<IModuleDocument>;
