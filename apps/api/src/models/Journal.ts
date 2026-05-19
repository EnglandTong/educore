import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

export interface IJournalDocument {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  date: Date;
  mood: "happy" | "calm" | "sad" | "anxious" | "angry" | "tired";
  content?: string;
  isPrivate: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const journalSchema = new Schema<IJournalDocument>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User", index: true },
    date: { type: Date, required: true },
    mood: { type: String, enum: ["happy", "calm", "sad", "anxious", "angry", "tired"], required: true },
    content: { type: String, maxlength: 2000 },
    isPrivate: { type: Boolean, default: false }
  },
  { timestamps: true }
);

journalSchema.index({ userId: 1, date: -1 });

export const Journal = (models.Journal ?? model<IJournalDocument>("Journal", journalSchema)) as mongoose.Model<IJournalDocument>;
