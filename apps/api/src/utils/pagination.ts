export interface CursorPage<T> {
  items: T[];
  nextCursor?: string;
  hasMore: boolean;
}

export function encodeCursor(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

export function decodeCursor(cursor?: string): string | undefined {
  if (!cursor) {
    return undefined;
  }
  return Buffer.from(cursor, "base64url").toString("utf8");
}
