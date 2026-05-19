import type { ApiErrorBody, ApiErrorDetail } from "@educore/types";

export type AppErrorCode = ApiErrorBody["code"];

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: AppErrorCode;
  public readonly details?: ApiErrorDetail[];

  public constructor(statusCode: number, code: AppErrorCode, message: string, details?: ApiErrorDetail[]) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export const warmErrors = {
  validation: "A few details need another look. Please adjust them and try again.",
  unauthorized: "Let's get you signed in so we can keep your progress safe.",
  forbidden: "This area is protected for another learner. Let's head back to your own space.",
  notFound: "We could not find that yet. It may have moved, so let's try another path.",
  conflict: "That already exists. Try a small change and we can keep going.",
  rateLimited: "You're moving quickly. Take a short pause, then try again.",
  internal: "Something went wrong on our end. Let's try again in a moment."
} as const;
