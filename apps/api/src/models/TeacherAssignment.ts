import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

export interface ITeacherAssignmentDocument {
  _id: mongoose.Types.ObjectId;
  teacherId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const teacherAssignmentSchema = new Schema<ITeacherAssignmentDocument>(
  {
    teacherId: { type: Schema.Types.ObjectId, required: true, ref: "User", index: true },
    studentId: { type: Schema.Types.ObjectId, required: true, ref: "User", index: true }
  },
  { timestamps: true }
);

teacherAssignmentSchema.index({ teacherId: 1, studentId: 1 }, { unique: true });

export const TeacherAssignment = (models.TeacherAssignment ?? model<ITeacherAssignmentDocument>("TeacherAssignment", teacherAssignmentSchema)) as mongoose.Model<ITeacherAssignmentDocument>;
