/**
 * seed-demo.ts — Creates demo accounts for production deploy verification.
 *
 * Creates (idempotent — skips if already present):
 *   - 1 student (Emily, 10yo, inviteCode: DEMO-EMILY)
 *   - 1 parent (Mrs. Chen)
 *   - 1 teacher (Ms. Anderson)
 *   - GuardianLink: parent → student (with consent)
 *   - TeacherAssignment: teacher → student
 *
 * Usage: pnpm --filter @educore/api db:seed-demo
 */

import mongoose from "mongoose";

import { connectDatabase, disconnectDatabase } from "../config/database.js";
import { connectRedis, disconnectRedis } from "../config/redis.js";
import { loadModules } from "../services/moduleLoader.js";
import { hashPassword } from "../services/auth.service.js";
import { User } from "../models/User.js";
import { GuardianLink } from "../models/GuardianLink.js";
import { TeacherAssignment } from "../models/TeacherAssignment.js";

interface DemoUser {
  name: string;
  email: string;
  password: string;
  role: string;
  age?: number;
  gradeLevel?: string;
  inviteCode?: string;
}

const DEMO_PASSWORD = "demo123";

const DEMO_STUDENT: DemoUser = {
  name: "Emily",
  email: "demo.student@educore.example",
  password: DEMO_PASSWORD,
  role: "student",
  age: 10,
  gradeLevel: "5",
  inviteCode: "DEMO-EMILY"
};

const DEMO_PARENT: DemoUser = {
  name: "Mrs. Chen",
  email: "demo.parent@educore.example",
  password: DEMO_PASSWORD,
  role: "parent"
};

const DEMO_TEACHER: DemoUser = {
  name: "Ms. Anderson",
  email: "demo.teacher@educore.example",
  password: DEMO_PASSWORD,
  role: "teacher"
};

async function createUserIfMissing(user: DemoUser): Promise<mongoose.Types.ObjectId | null> {
  const existing = await User.findOne({ email: user.email }).exec();
  if (existing) {
    console.log(`  ⏭  ${user.role}: ${user.name} (${user.email}) — already exists`);
    return existing._id;
  }

  const created = await User.create({
    name: user.name,
    email: user.email,
    passwordHash: hashPassword(user.password),
    role: user.role,
    age: user.age,
    gradeLevel: user.gradeLevel,
    inviteCode: user.inviteCode
  });

  console.log(`  ✅ ${user.role}: ${user.name} (${user.email}) — created`);
  return created._id;
}

async function main(): Promise<void> {
  console.log("\n🌱 EduCore — Seed Demo Accounts\n");
  console.log("Connecting to database and cache…");

  await connectDatabase();
  await connectRedis();

  console.log("Loading modules…");
  await loadModules();

  console.log("\nCreating demo accounts:\n");

  // 1. Create users (idempotent)
  const studentId = await createUserIfMissing(DEMO_STUDENT);
  const parentId = await createUserIfMissing(DEMO_PARENT);
  const teacherId = await createUserIfMissing(DEMO_TEACHER);

  if (!studentId || !parentId || !teacherId) {
    console.error("\n❌ Failed to create one or more demo users. Aborting.");
    process.exit(1);
  }

  // 2. GuardianLink: parent → student (with consent)
  const existingLink = await GuardianLink.findOne({
    parentId,
    studentId
  }).exec();

  if (existingLink) {
    if (!existingLink.consentGiven) {
      existingLink.consentGiven = true;
      existingLink.consentDate = new Date();
      await existingLink.save();
      console.log("  🔗 GuardianLink: consent updated for Mrs. Chen → Emily");
    } else {
      console.log("  ⏭  GuardianLink: Mrs. Chen → Emily — already linked with consent");
    }
  } else {
    await GuardianLink.create({
      parentId,
      studentId,
      relationship: "mother",
      consentGiven: true,
      consentDate: new Date()
    });
    console.log("  ✅ GuardianLink: Mrs. Chen → Emily (mother, consent given)");
  }

  // 3. TeacherAssignment: teacher → student
  const existingAssignment = await TeacherAssignment.findOne({
    teacherId,
    studentId
  }).exec();

  if (existingAssignment) {
    console.log("  ⏭  TeacherAssignment: Ms. Anderson → Emily — already assigned");
  } else {
    await TeacherAssignment.create({
      teacherId,
      studentId
    });
    console.log("  ✅ TeacherAssignment: Ms. Anderson → Emily");
  }

  console.log("\n---");
  console.log("Demo accounts ready!\n");
  console.log("  Student:  demo.student@educore.example  /  demo123");
  console.log("  Parent:   demo.parent@educore.example   /  demo123");
  console.log("  Teacher:  demo.teacher@educore.example  /  demo123");
  console.log("");

  await disconnectRedis();
  await disconnectDatabase();

  console.log("Done.\n");
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
