import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

export interface IMessageDocument {
  _id: mongoose.Types.ObjectId;
  conversationId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  senderName: string;
  senderRole: "teacher" | "parent";
  content: string;
  sentAt: Date;
  readAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const messageSchema = new Schema<IMessageDocument>(
  {
    conversationId: { type: Schema.Types.ObjectId, required: true, ref: "Conversation", index: true },
    senderId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    senderName: { type: String, required: true },
    senderRole: { type: String, enum: ["teacher", "parent"], required: true },
    content: { type: String, required: true },
    sentAt: { type: Date, default: Date.now },
    readAt: Date
  },
  { timestamps: true }
);

export const Message = (models.Message ?? model<IMessageDocument>("Message", messageSchema)) as mongoose.Model<IMessageDocument>;
