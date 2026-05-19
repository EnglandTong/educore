import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

export interface IMoodLogDocument {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  date: Date;
  mood: "😊" | "😌" | "😢" | "😰" | "😤" | "😴" | "🤔" | "🥰";
  note?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const moodLogSchema = new Schema<IMoodLogDocument>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User", index: true },
    date: { type: Date, required: true },
    mood: { type: String, enum: ["😊", "😌", "😢", "😰", "😤", "😴", "🤔", "🥰"], required: true },
    note: { type: String, maxlength: 200 }
  },
  { timestamps: true }
);

moodLogSchema.index({ userId: 1, date: -1 });

export const MoodLog = (models.MoodLog ?? model<IMoodLogDocument>("MoodLog", moodLogSchema)) as mongoose.Model<IMoodLogDocument>;
