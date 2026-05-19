import type { NotificationItem } from "@educore/types";

import { Notification } from "../models/Notification.js";
import { AppError } from "../utils/errors.js";

function toNotification(doc: any): NotificationItem {
  return {
    id: String(doc._id),
    userId: String(doc.userId),
    title: doc.title,
    body: doc.body,
    type: doc.type,
    readAt: doc.readAt ? new Date(doc.readAt).toISOString() : undefined,
    data: doc.data ?? {}
  };
}

export async function listNotifications(userId: string) {
  const docs = await Notification.find({ userId }).sort({ createdAt: -1 }).lean();
  return docs.map(toNotification);
}

export async function markNotificationRead(userId: string, notificationId: string) {
  const updated = await Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { $set: { readAt: new Date() } },
    { new: true }
  ).lean();

  if (!updated) {
    throw new AppError(404, "NOT_FOUND", "We could not find that notification yet.");
  }

  return toNotification(updated);
}
