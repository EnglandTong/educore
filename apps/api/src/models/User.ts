import mongoose from "mongoose";
import type { UserRole } from "@educore/types";
const { Schema, model, models } = mongoose;

export interface IUserDocument {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  avatar?: string;
  nickname?: string;
  age?: number;
  gradeLevel?: string;
  inviteCode?: string;
  schoolId?: string;
  managedSchoolIds?: string[];
  preferences?: {
    language: "en" | "zh";
    theme: "light" | "dark" | "auto";
    dailyGoal?: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["student", "parent", "teacher", "admin", "volunteer", "school-admin"], required: true },
    avatar: String,
    nickname: String,
    age: Number,
    gradeLevel: String,
    inviteCode: { type: String, index: true },
    schoolId: { type: String, index: true },
    managedSchoolIds: [{ type: String }],
    preferences: {
      language: { type: String, enum: ["en", "zh"], default: "en" },
      theme: { type: String, enum: ["light", "dark", "auto"], default: "auto" },
      dailyGoal: Number
    }
  },
  { timestamps: true }
);

export const User = (models.User ?? model<IUserDocument>("User", userSchema)) as mongoose.Model<IUserDocument>;
