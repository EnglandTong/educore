import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

export interface IProudMomentDocument {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  reactions: Array<{
    userId: mongoose.Types.ObjectId;
    type: "heart" | "star" | "thumbsup" | "hug";
    createdAt: Date;
  }>;
  createdAt?: Date;
  updatedAt?: Date;
}

const proudMomentSchema = new Schema<IProudMomentDocument>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User", index: true },
    title: { type: String, required: true, maxlength: 100 },
    description: { type: String, maxlength: 500 },
    reactions: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        type: { type: String, enum: ["heart", "star", "thumbsup", "hug"], required: true },
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

export const ProudMoment = (models.ProudMoment ?? model<IProudMomentDocument>("ProudMoment", proudMomentSchema)) as mongoose.Model<IProudMomentDocument>;
