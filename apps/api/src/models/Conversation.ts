import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

export interface IConversationDocument {
  _id: mongoose.Types.ObjectId;
  teacherId: mongoose.Types.ObjectId;
  teacherName: string;
  parentId: mongoose.Types.ObjectId;
  parentName: string;
  studentId: mongoose.Types.ObjectId;
  studentName: string;
  lastMessage?: string;
  lastMessageAt?: Date;
  unreadByUserIds: mongoose.Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

const conversationSchema = new Schema<IConversationDocument>(
  {
    teacherId: { type: Schema.Types.ObjectId, required: true, ref: "User", index: true },
    teacherName: { type: String, required: true },
    parentId: { type: Schema.Types.ObjectId, required: true, ref: "User", index: true },
    parentName: { type: String, required: true },
    studentId: { type: Schema.Types.ObjectId, required: true, ref: "User", index: true },
    studentName: { type: String, required: true },
    lastMessage: String,
    lastMessageAt: Date,
    unreadByUserIds: [{ type: Schema.Types.ObjectId, ref: "User" }]
  },
  { timestamps: true }
);

conversationSchema.index({ teacherId: 1, parentId: 1, studentId: 1 }, { unique: true });

export const Conversation = (models.Conversation ?? model<IConversationDocument>("Conversation", conversationSchema)) as mongoose.Model<IConversationDocument>;
