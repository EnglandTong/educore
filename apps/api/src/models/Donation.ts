import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

export interface IDonationDocument {
  _id: mongoose.Types.ObjectId;
  donorName: string;
  email: string;
  amount: number;
  message?: string;
  isPublic: boolean;
  status: "pending" | "completed" | "failed";
  completedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const donationSchema = new Schema<IDonationDocument>(
  {
    donorName: { type: String, required: true, maxlength: 100 },
    email: { type: String, required: true },
    amount: { type: Number, required: true, min: 0.01 },
    message: { type: String, maxlength: 500 },
    isPublic: { type: Boolean, default: false },
    status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
    completedAt: { type: Date }
  },
  { timestamps: true }
);

donationSchema.index({ status: 1, createdAt: -1 });

export const Donation = (models.Donation ?? model<IDonationDocument>("Donation", donationSchema)) as mongoose.Model<IDonationDocument>;
