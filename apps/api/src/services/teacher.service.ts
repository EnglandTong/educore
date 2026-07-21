import type { MasteryLevel } from "@educore/types";
import { scoreToMasteryLevel } from "@educore/constants";

import { TeacherAssignment } from "../models/TeacherAssignment.js";
import { SkillMastery } from "../models/SkillMastery.js";
import { User } from "../models/User.js";
import { AppError } from "../utils/errors.js";
import { getProgressOverview } from "./progress.service.js";

function toLevel(score: number): MasteryLevel {
  return scoreToMasteryLevel(score);
}

export async function getClassOverview(teacherId: string) {
  const assignments = (await TeacherAssignment.find({ teacherId }).lean()) as Array<{ studentId: unknown }>;
  const studentIds = assignments.map((assignment) => assignment.studentId);
  const students = (await User.find({ _id: { $in: studentIds }, role: "student" }).lean()) as Array<{ _id: unknown; name: string; gradeLevel?: string }>;
  const masteries = (await SkillMastery.find({ studentId: { $in: studentIds } }).lean()) as Array<{ moduleId: string; skillId: string; skillName: string; score: number }>;
  const gradeGroups: Record<string, number> = {};
  for (const student of students) {
    const grade = student.gradeLevel ?? "unassigned";
    gradeGroups[grade] = (gradeGroups[grade] ?? 0) + 1;
  }

  const averageScore = masteries.length > 0
    ? Math.round(masteries.reduce((sum: number, mastery) => sum + mastery.score, 0) / masteries.length)
    : 0;

  const weakAreaMap = new Map<string, { skillId: string; skillName: string; total: number; count: number }>();
  for (const mastery of masteries) {
    const key = `${mastery.moduleId}:${mastery.skillId}`;
    const existing = weakAreaMap.get(key) ?? {
      skillId: mastery.skillId,
      skillName: mastery.skillName,
      total: 0,
      count: 0
    };
    existing.total += mastery.score;
    existing.count += 1;
    weakAreaMap.set(key, existing);
  }

  const topWeakAreas = Array.from(weakAreaMap.values())
    .map((item) => ({
      skillId: item.skillId,
      skillName: item.skillName,
      averageScore: item.count > 0 ? Math.round(item.total / item.count) : 0,
      level: toLevel(item.count > 0 ? item.total / item.count : 0)
    }))
    .sort((a, b) => a.averageScore - b.averageScore)
    .slice(0, 10);

  return {
    teacherId,
    studentCount: students.length,
    averageScore,
    gradeGroups,
    topWeakAreas,
    students: students.map((student) => ({
      id: String(student._id),
      name: student.name,
      gradeLevel: student.gradeLevel,
    })),
  };
}

export async function getStudentSummary(teacherId: string, studentId: string) {
  const assignment = await TeacherAssignment.findOne({ teacherId, studentId }).lean();
  if (!assignment) {
    throw new AppError(404, "NOT_FOUND", "We could not find that student in your assigned group.");
  }

  const student = await User.findOne({ _id: studentId, role: "student" }).lean() as { _id: unknown; name: string; gradeLevel?: string; avatar?: string; nickname?: string } | null;
  if (!student) {
    return null;
  }

  const progress = await getProgressOverview(studentId);
  const studentMasteries = (await SkillMastery.find({ studentId }).lean()) as Array<{ score: number }>;

  return {
    teacherId,
    student: {
      id: String(student._id),
      name: student.name,
      gradeLevel: student.gradeLevel,
      avatar: student.avatar,
      nickname: student.nickname
    },
    progress,
    masteryCount: studentMasteries.length,
    activeSkills: studentMasteries.filter((mastery) => mastery.score >= 70).length
  };
}

export async function getClassWeakAreas(teacherId: string) {
  const assignments = (await TeacherAssignment.find({ teacherId }).lean()) as Array<{ studentId: unknown }>;
  const studentIds = assignments.map((assignment) => assignment.studentId);
  const masteries = (await SkillMastery.find({ studentId: { $in: studentIds } }).lean()) as Array<{ moduleId: string; skillId: string; skillName: string; score: number }>;
  const bySkillMap = new Map<string, { skillId: string; skillName: string; total: number; count: number; moduleId: string }>();
  for (const mastery of masteries) {
    const key = `${mastery.moduleId}:${mastery.skillId}`;
    const existing = bySkillMap.get(key) ?? {
      skillId: mastery.skillId,
      skillName: mastery.skillName,
      moduleId: mastery.moduleId,
      total: 0,
      count: 0
    };
    existing.total += mastery.score;
    existing.count += 1;
    bySkillMap.set(key, existing);
  }

  const bySkill = Array.from(bySkillMap.values())
    .map((item) => ({
      moduleId: item.moduleId,
      skillId: item.skillId,
      skillName: item.skillName,
      averageScore: item.count > 0 ? Math.round(item.total / item.count) : 0,
      level: toLevel(item.count > 0 ? item.total / item.count : 0)
    }))
    .sort((a, b) => a.averageScore - b.averageScore)
    .slice(0, 10);

  return {
    weakAreas: bySkill
  };
}

export async function getTeacherAssignments(teacherId: string) {
  const assignments = (await TeacherAssignment.find({ teacherId }).lean()) as Array<{
    studentId: unknown
    createdAt?: Date
  }>
  const studentIds = assignments.map((a) => a.studentId)
  const students = (await User.find({ _id: { $in: studentIds }, role: 'student' }).lean()) as Array<{
    _id: unknown
    name: string
    gradeLevel?: string
  }>
  const studentById = new Map(students.map((s) => [String(s._id), s]))

  const items = assignments
    .map((assignment) => {
      const student = studentById.get(String(assignment.studentId))
      if (!student) return null
      return {
        studentId: String(student._id),
        studentName: student.name,
        gradeLevel: student.gradeLevel,
        assignedAt: assignment.createdAt?.toISOString() ?? new Date(0).toISOString(),
      }
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .sort((a, b) => a.studentName.localeCompare(b.studentName))

  return { assignments: items }
}
