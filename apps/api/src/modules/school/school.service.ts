import mongoose from "mongoose";

import { School } from "../../models/School.js";
import { User } from "../../models/User.js";
import type { UpdateSchoolInput } from "./school.schema.js";

export async function getSchool(schoolId: string) {
  const school = await School.findById(schoolId).lean().exec();
  return school;
}

export async function updateSchool(schoolId: string, input: UpdateSchoolInput) {
  const school = await School.findByIdAndUpdate(
    schoolId,
    { $set: input },
    { new: true }
  ).lean().exec();
  return school;
}

export async function listStudents(schoolId: string) {
  const students = await User.find({
    schoolId: new mongoose.Types.ObjectId(schoolId),
    role: "student"
  })
    .select("_id name email createdAt")
    .lean()
    .exec();
  return students;
}

export async function listTeachers(schoolId: string) {
  const teachers = await User.find({
    schoolId: new mongoose.Types.ObjectId(schoolId),
    role: "teacher"
  })
    .select("_id name email createdAt")
    .lean()
    .exec();
  return teachers;
}

export async function getSchoolOverview(schoolId: string) {
  const studentCount = await User.countDocuments({
    schoolId: new mongoose.Types.ObjectId(schoolId),
    role: "student"
  }).exec();
  const teacherCount = await User.countDocuments({
    schoolId: new mongoose.Types.ObjectId(schoolId),
    role: "teacher"
  }).exec();

  return {
    studentCount,
    teacherCount,
    totalUsers: studentCount + teacherCount
  };
}
