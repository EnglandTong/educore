import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

export interface IQAAnswerDocument {
  _id: mongoose.Types.ObjectId;
  questionId: mongoose.Types.ObjectId;
  volunteerId: mongoose.Types.ObjectId;
  content: string;
  rating?: number;
  isAccepted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const qaAnswerSchema = new Schema<IQAAnswerDocument>(
  {
    questionId: { type: Schema.Types.ObjectId, required: true, ref: "QAQuestion", index: true },
    volunteerId: { type: Schema.Types.ObjectId, required: true, ref: "User", index: true },
    content: { type: String, required: true, maxlength: 2000 },
    rating: { type: Number, min: 1, max: 5 },
    isAccepted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const QAAnswer = (models.QAAnswer ?? model<IQAAnswerDocument>("QAAnswer", qaAnswerSchema)) as mongoose.Model<IQAAnswerDocument>;
