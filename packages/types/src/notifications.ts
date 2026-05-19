export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: string;
  readAt?: string;
  data?: Record<string, unknown>;
}
