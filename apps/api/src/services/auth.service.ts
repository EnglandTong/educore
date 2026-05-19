import { randomBytes, randomUUID, scryptSync } from "node:crypto";
import { SignJWT, jwtVerify } from "jose";

import { env } from "../config/env.js";
import { getRedis } from "../config/redis.js";
import { User } from "../models/User.js";
import { AppError, warmErrors } from "../utils/errors.js";

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: "student" | "parent" | "teacher";
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface UserProfileDTO {
  id: string;
  name: string;
  email: string;
  role: "student" | "parent" | "teacher" | "admin" | "volunteer" | "school-admin";
  avatar?: string;
  nickname?: string;
  age?: number;
  gradeLevel?: string;
  createdAt: string;
  preferences?: {
    language: "en" | "zh";
    theme: "light" | "dark" | "auto";
    dailyGoal?: number;
  };
}

const secret = new TextEncoder().encode(env.JWT_SECRET);

function refreshTokenKey(userId: string): string {
  return `auth:refresh:${userId}`;
}

function parseExpiryToSeconds(expiry: string): number | undefined {
  const match = /^(\d+)([smhd])$/i.exec(expiry.trim());
  if (!match) {
    return undefined;
  }

  const value = Number(match[1]);
  const unit = match[2]?.toLowerCase();
  if (!unit) {
    return undefined;
  }
  switch (unit) {
    case "s":
      return value;
    case "m":
      return value * 60;
    case "h":
      return value * 60 * 60;
    case "d":
      return value * 60 * 60 * 24;
    default:
      return undefined;
  }
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, derived] = storedHash.split(":");
  if (!salt || !derived) {
    return false;
  }
  const computed = scryptSync(password, salt, 64).toString("hex");
  return computed.length === derived.length && computed === derived;
}

export function toUserProfile(user: {
  _id: unknown;
  name: string;
  email: string;
  role: UserProfileDTO["role"];
  avatar?: string;
  nickname?: string;
  age?: number;
  gradeLevel?: string;
  createdAt?: Date;
  preferences?: UserProfileDTO["preferences"];
}): UserProfileDTO {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    nickname: user.nickname,
    age: user.age,
    gradeLevel: user.gradeLevel,
    createdAt: user.createdAt instanceof Date ? user.createdAt.toISOString() : new Date(user.createdAt ?? new Date()).toISOString(),
    preferences: user.preferences
  };
}

export function generateInviteCode(): string {
  return randomBytes(4).toString("hex").toUpperCase();
}

async function signToken(
  user: { id: string; email: string; role: string },
  tokenType: "access" | "refresh",
  expiry: string,
  sessionId: string
): Promise<string> {
  return new SignJWT({
    email: user.email,
    role: user.role,
    tokenType
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setJti(sessionId)
    .setIssuedAt()
    .setExpirationTime(expiry)
    .sign(secret);
}

export async function createTokenPair(user: { id: string; email: string; role: string }): Promise<TokenPair> {
  const sessionId = randomUUID();
  const refreshExpirySeconds = parseExpiryToSeconds(env.JWT_REFRESH_EXPIRY);
  
  // Redis is optional — skip token rotation storage in degraded mode
  try {
    const refreshKey = refreshTokenKey(user.id);
    const redis = getRedis();
    if (redis.status === "ready") {
      if (refreshExpirySeconds) {
        await redis.set(refreshKey, sessionId, "EX", refreshExpirySeconds);
      } else {
        await redis.set(refreshKey, sessionId);
      }
    }
  } catch {
    // Session rotation storage unavailable — tokens still work for their JWT lifetime
  }

  return {
    accessToken: await signToken(user, "access", env.JWT_ACCESS_EXPIRY, sessionId),
    refreshToken: await signToken(user, "refresh", env.JWT_REFRESH_EXPIRY, sessionId)
  };
}

export async function registerUser(input: RegisterInput): Promise<{ user: UserProfileDTO } & TokenPair> {
  const existing = await User.findOne({ email: input.email }).lean();
  if (existing) {
    throw new AppError(409, "CONFLICT", "That email is already in use. Let's try a different one.");
  }

  const created = await User.create({
    ...input,
    passwordHash: hashPassword(input.password),
    inviteCode: input.role === "student" ? generateInviteCode() : undefined,
    preferences: { language: "en", theme: "auto" }
  });

  const user = toUserProfile(created.toObject());
  const tokens = await createTokenPair({ id: user.id, email: user.email, role: user.role });
  return { user, ...tokens };
}

export async function loginUser(input: LoginInput): Promise<{ user: UserProfileDTO } & TokenPair> {
  const user = await User.findOne({ email: input.email });
  if (!user || !verifyPassword(input.password, user.passwordHash)) {
    throw new AppError(401, "UNAUTHORIZED", "Hmm, that email or password does not seem to match. Please try again.");
  }

  const profile = toUserProfile(user.toObject());
  const tokens = await createTokenPair({ id: profile.id, email: profile.email, role: profile.role });
  return { user: profile, ...tokens };
}

export async function refreshTokenPair(refreshToken: string): Promise<TokenPair> {
  try {
    const { payload } = await jwtVerify(refreshToken, secret);
    if (payload.tokenType !== "refresh") {
      throw new Error("Expected refresh token");
    }

    const userId = String(payload.sub);
    const user = await User.findById(userId).lean();
    if (!user) {
      throw new AppError(401, "UNAUTHORIZED", warmErrors.unauthorized);
    }

    const storedJti = await getRedis().get(refreshTokenKey(userId)).catch(() => null);
    if (!storedJti || storedJti !== payload.jti) {
      throw new AppError(401, "UNAUTHORIZED", "This session needs a quick refresh. Please sign in again.");
    }

    return createTokenPair({ id: String(user._id), email: user.email, role: user.role });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(401, "UNAUTHORIZED", "This session needs a quick refresh. Please sign in again.");
  }
}

export async function getCurrentUserProfile(userId: string): Promise<UserProfileDTO> {
  const user = await User.findById(userId).lean();
  if (!user) {
    throw new AppError(404, "NOT_FOUND", "We could not find your profile yet. Please sign in again.");
  }

  return toUserProfile(user);
}

export async function updateCurrentUserProfile(
  userId: string,
  patch: Record<string, unknown>
): Promise<UserProfileDTO> {
  // 字段白名单：禁止修改 role / email / passwordHash 等敏感字段
  const ALLOWED_FIELDS = ['name', 'nickname', 'avatar', 'age', 'gradeLevel', 'preferences'] as const;
  const safePatch: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(patch)) {
    if (ALLOWED_FIELDS.includes(key as typeof ALLOWED_FIELDS[number])) {
      safePatch[key] = value;
    }
  }

  const updated = await User.findByIdAndUpdate(
    userId,
    { $set: safePatch },
    { new: true }
  ).lean();

  if (!updated) {
    throw new AppError(404, "NOT_FOUND", "We could not find your profile yet. Please sign in again.");
  }

  return toUserProfile(updated);
}
