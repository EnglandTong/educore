import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

export type INotificationData =
  | { kind: "achievement"; achievementId: string; title: string }
  | { kind: "progress"; skillId: string; mastery: number }
  | { kind: "message"; conversationId: string; senderId: string; preview: string }
  | { kind: "reminder"; action: string; dueAt?: string }
  | { kind: "system"; alert: string; severity: "info" | "warning" | "critical" }
  | Record<string, unknown>;

export interface INotificationDocument {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  title: string;
  body: string;
  type: string;
  readAt?: Date;
  data: INotificationData;
  createdAt?: Date;
  updatedAt?: Date;
}

const notificationSchema = new Schema<INotificationDocument>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User", index: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    type: { type: String, required: true },
    readAt: Date,
    data: { type: Object, default: {} }
  },
  { timestamps: true }
);

notificationSchema.index({ userId: 1, readAt: 1, createdAt: -1 });

export const Notification = (models.Notification ?? model<INotificationDocument>("Notification", notificationSchema)) as mongoose.Model<INotificationDocument>;
