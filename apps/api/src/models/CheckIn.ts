import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

export interface ICheckInDocument {
  _id: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  date: string;
  mood: "sunny" | "cloudy" | "rainy" | "stormy";
  emoji?: string;
  note?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const checkInSchema = new Schema<ICheckInDocument>(
  {
    studentId: { type: Schema.Types.ObjectId, required: true, ref: "User", index: true },
    date: { type: String, required: true },
    mood: { type: String, enum: ["sunny", "cloudy", "rainy", "stormy"], required: true },
    emoji: { type: String, maxlength: 10 },
    note: { type: String, maxlength: 500 }
  },
  { timestamps: true }
);

checkInSchema.index({ studentId: 1, date: 1 }, { unique: true });

export const CheckIn = (models.CheckIn ?? model<ICheckInDocument>("CheckIn", checkInSchema)) as mongoose.Model<ICheckInDocument>;
