import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

export interface IQAQuestionDocument {
  _id: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  moduleId?: string;
  skillId?: string;
  content: string;
  status: "open" | "answered" | "closed";
  answers: mongoose.Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

const qaQuestionSchema = new Schema<IQAQuestionDocument>(
  {
    studentId: { type: Schema.Types.ObjectId, required: true, ref: "User", index: true },
    moduleId: { type: String },
    skillId: { type: String },
    content: { type: String, required: true, maxlength: 1000 },
    status: { type: String, enum: ["open", "answered", "closed"], default: "open" },
    answers: [{ type: Schema.Types.ObjectId, ref: "QAAnswer" }]
  },
  { timestamps: true }
);

qaQuestionSchema.index({ status: 1, createdAt: -1 });

export const QAQuestion = (models.QAQuestion ?? model<IQAQuestionDocument>("QAQuestion", qaQuestionSchema)) as mongoose.Model<IQAQuestionDocument>;
