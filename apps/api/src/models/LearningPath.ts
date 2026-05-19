import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

export interface ILearningPathDocument {
  _id: mongoose.Types.ObjectId;
  teacherId: string;
  title: string;
  description: string;
  moduleId: string;
  nodes: Array<{
    id: string;
    type: "module" | "skill" | "condition" | "review" | "challenge";
    moduleId?: string;
    skillId?: string;
    label: string;
    positionX: number;
    positionY: number;
    difficulty?: number;
    branches: Array<{
      skillId: string;
      operator: "gte" | "lt" | "eq";
      thresholdScore: number;
      targetNodeId: string;
    }>;
  }>;
  edges: Array<{
    id: string;
    sourceNodeId: string;
    targetNodeId: string;
    condition?: {
      type: "always" | "score_above" | "score_below";
      threshold?: number;
    };
  }>;
  status: "draft" | "published" | "archived";
  assignedClassIds: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const branchConditionSchema = new Schema(
  {
    skillId: { type: String, required: true },
    operator: { type: String, enum: ["gte", "lt", "eq"], required: true },
    thresholdScore: { type: Number, required: true },
    targetNodeId: { type: String, required: true }
  },
  { _id: false }
);

const nodeSchema = new Schema(
  {
    id: { type: String, required: true },
    type: {
      type: String,
      enum: ["module", "skill", "condition", "review", "challenge"],
      required: true
    },
    moduleId: String,
    skillId: String,
    label: { type: String, required: true },
    positionX: { type: Number, required: true },
    positionY: { type: Number, required: true },
    difficulty: Number,
    branches: { type: [branchConditionSchema], default: [] }
  },
  { _id: false }
);

const edgeConditionSchema = new Schema(
  {
    type: { type: String, enum: ["always", "score_above", "score_below"], required: true },
    threshold: Number
  },
  { _id: false }
);

const edgeSchema = new Schema(
  {
    id: { type: String, required: true },
    sourceNodeId: { type: String, required: true },
    targetNodeId: { type: String, required: true },
    condition: edgeConditionSchema
  },
  { _id: false }
);

const learningPathSchema = new Schema<ILearningPathDocument>(
  {
    teacherId: { type: String, required: true, index: true },
    title: { type: String, required: true, maxlength: 200 },
    description: { type: String, default: "", maxlength: 1000 },
    moduleId: { type: String, default: "" },
    nodes: { type: [nodeSchema], default: [] },
    edges: { type: [edgeSchema], default: [] },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft"
    },
    assignedClassIds: { type: [String], default: [] }
  },
  { timestamps: true }
);

learningPathSchema.index({ teacherId: 1, status: 1 });
learningPathSchema.index({ teacherId: 1, updatedAt: -1 });

export const LearningPath = (models.LearningPath ??
  model<ILearningPathDocument>("LearningPath", learningPathSchema)) as mongoose.Model<ILearningPathDocument>;
