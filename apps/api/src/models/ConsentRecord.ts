import mongoose from "mongoose";
import type { ConsentStatus, ConsentType } from "@educore/types";
const { Schema, model, models } = mongoose;

export interface IConsentRecordDocument {
  _id: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  consentType: ConsentType;
  status: ConsentStatus;
  grantedBy: mongoose.Types.ObjectId;
  grantedAt?: Date;
  revokedAt?: Date;
  expiresAt?: Date;
  auditNote?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const consentRecordSchema = new Schema<IConsentRecordDocument>(
  {
    studentId: { type: Schema.Types.ObjectId, required: true, ref: "User", index: true },
    consentType: { type: String, required: true, enum: ["parent-guardian", "school", "volunteer-contact", "enterprise-contact", "mentorship", "data-sharing"] },
    status: { type: String, required: true, enum: ["pending", "granted", "revoked", "expired"], default: "pending" },
    grantedBy: { type: Schema.Types.ObjectId, required: true, ref: "User", index: true },
    grantedAt: Date,
    revokedAt: Date,
    expiresAt: Date,
    auditNote: String
  },
  { timestamps: true }
);

consentRecordSchema.index({ studentId: 1, consentType: 1 }, { unique: true });

export const ConsentRecord = (models.ConsentRecord ?? model<IConsentRecordDocument>("ConsentRecord", consentRecordSchema)) as mongoose.Model<IConsentRecordDocument>;
