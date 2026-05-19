import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

export interface ISchoolDocument {
  _id: mongoose.Types.ObjectId;
  name: string;
  code: string;
  region: string;
  address?: string;
  contactPhone?: string;
  adminIds: mongoose.Types.ObjectId[];
  teacherIds: mongoose.Types.ObjectId[];
  studentCount: number;
  settings: {
    allowedModules?: string[];
    academicYear?: string;
    timezone: string;
  };
  status: "active" | "inactive" | "pending";
  createdAt?: Date;
  updatedAt?: Date;
}

const schoolSchema = new Schema<ISchoolDocument>(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true, index: true },
    region: { type: String, required: true },
    address: String,
    contactPhone: String,
    adminIds: [{ type: Schema.Types.ObjectId, ref: "User" }],
    teacherIds: [{ type: Schema.Types.ObjectId, ref: "User" }],
    studentCount: { type: Number, default: 0 },
    settings: {
      allowedModules: [{ type: String }],
      academicYear: String,
      timezone: { type: String, default: "Asia/Shanghai" },
    },
    status: { type: String, enum: ["active", "inactive", "pending"], default: "pending" },
  },
  { timestamps: true }
);

export const School = (models.School ?? model<ISchoolDocument>("School", schoolSchema)) as mongoose.Model<ISchoolDocument>;
