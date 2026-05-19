import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

export interface IGuardianLinkDocument {
  _id: mongoose.Types.ObjectId;
  parentId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  relationship: string;
  consentGiven: boolean;
  consentDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const guardianLinkSchema = new Schema<IGuardianLinkDocument>(
  {
    parentId: { type: Schema.Types.ObjectId, required: true, ref: "User", index: true },
    studentId: { type: Schema.Types.ObjectId, required: true, ref: "User", index: true },
    relationship: { type: String, required: true },
    consentGiven: { type: Boolean, default: false },
    consentDate: Date
  },
  { timestamps: true }
);

guardianLinkSchema.index({ parentId: 1, studentId: 1 }, { unique: true });

export const GuardianLink = (models.GuardianLink ?? model<IGuardianLinkDocument>("GuardianLink", guardianLinkSchema)) as mongoose.Model<IGuardianLinkDocument>;
