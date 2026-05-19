import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

export interface IVolunteerProfileDocument {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  expertise: string[];
  bio?: string;
  status: "pending" | "active" | "suspended";
  verifiedAt?: Date;
  stats: {
    questionsAnswered: number;
    helpfulCount: number;
    totalContributions: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const volunteerProfileSchema = new Schema<IVolunteerProfileDocument>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User", unique: true, index: true },
    expertise: [{ type: String }],
    bio: { type: String, maxlength: 500 },
    status: { type: String, enum: ["pending", "active", "suspended"], default: "pending" },
    verifiedAt: { type: Date },
    stats: {
      questionsAnswered: { type: Number, default: 0 },
      helpfulCount: { type: Number, default: 0 },
      totalContributions: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
);

export const VolunteerProfile = (models.VolunteerProfile ?? model<IVolunteerProfileDocument>("VolunteerProfile", volunteerProfileSchema)) as mongoose.Model<IVolunteerProfileDocument>;
