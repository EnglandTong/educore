import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

export interface IAnnouncementDocument {
  _id: mongoose.Types.ObjectId;
  schoolId: string;
  authorId: mongoose.Types.ObjectId;
  authorName: string;
  title: string;
  content: string;
  type: "news" | "event" | "curriculum" | "celebration";
  targetAudience: "all" | "class" | "grade";
  classIds?: string[];
  publishedAt: Date;
  readBy: mongoose.Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

const announcementSchema = new Schema<IAnnouncementDocument>(
  {
    schoolId: { type: String, required: true, index: true },
    authorId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    authorName: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    type: { type: String, enum: ["news", "event", "curriculum", "celebration"], required: true },
    targetAudience: { type: String, enum: ["all", "class", "grade"], required: true },
    classIds: [String],
    publishedAt: { type: Date, default: Date.now },
    readBy: [{ type: Schema.Types.ObjectId, ref: "User" }]
  },
  { timestamps: true }
);

export const Announcement = (models.Announcement ?? model<IAnnouncementDocument>("Announcement", announcementSchema)) as mongoose.Model<IAnnouncementDocument>;
