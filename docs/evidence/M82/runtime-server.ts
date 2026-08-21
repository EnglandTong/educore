import mongoose from "mongoose";
import { randomUUID } from "node:crypto";

process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "m82-local-audit-secret-32-chars";
const runId = `m82_audit_${Date.now()}_${randomUUID().slice(0, 8)}`;
process.env.MONGODB_URI = `mongodb://127.0.0.1:27017/${runId}`;
process.env.PORT = "3300";
process.env.HOST = "127.0.0.1";
process.env.CORS_ORIGIN = "http://127.0.0.1:5173";

async function main() {
  const { buildApp } = await import("../../../apps/api/src/app.ts");
  const { User } = await import("../../../apps/api/src/models/User.ts");
  const { Module } = await import("../../../apps/api/src/models/Module.ts");
  const { Question } = await import("../../../apps/api/src/models/Question.ts");
  const { getLoadedModules, getLoadedQuestions } = await import("../../../apps/api/src/services/moduleLoader.ts");
  const { hashPassword } = await import("../../../apps/api/src/services/auth.service.ts");
  await mongoose.connect(process.env.MONGODB_URI);
  // Use only a minimal valid fixture in the isolated audit database. The
  // repository seed corpus is audited separately; this harness must not
  // rewrite product seed files just to make runtime evidence possible.
  await Module.create({
    _id: "m82-audit-module",
    name: "M82 Audit Module",
    version: "1.0.0",
    subject: "math",
    category: "audit",
    description: "Isolated runtime evidence fixture",
    icon: "audit",
    color: "#000000",
    targetAge: { min: 8, max: 12 },
    skills: [{ id: "addition", name: "Addition", description: "", subSkills: [], order: 1 }],
    levels: [{ id: "basic", name: "Basic", gradeRange: "1-3", order: 1 }],
    diagnostic: { rounds: 1, questionsPerRound: 1, strategy: "adaptive" },
    training: { sessionLength: 1, adaptiveWeights: { weak: 1, current: 1, review: 1 }, masteryThreshold: 0.8 }
  });
  await Question.insertMany(Array.from({ length: 30 }, (_, index) => ({
    _id: `m82-audit-question-${index + 1}`,
    moduleId: "m82-audit-module",
    skill: "addition",
    level: "basic",
    questionType: "multiple-choice",
    difficulty: 0.2 + (index % 3) * 0.1,
    prompt: `What is ${index + 2} + 3?`,
    choices: [{ key: "A", text: String(index + 5) }, { key: "B", text: String(index + 6) }],
    answerKey: "A",
    explanation: `${index + 2} + 3 = ${index + 5}`,
    estimatedTimeSec: 30
  })));
  getLoadedModules().push({
    id: "m82-audit-module",
    name: "M82 Audit Module",
    version: "1.0.0",
    subject: "math",
    category: "audit",
    description: "Isolated runtime evidence fixture",
    icon: "audit",
    color: "#000000",
    targetAge: { min: 8, max: 12 },
    skills: [{ id: "addition", name: "Addition", description: "", subSkills: [], order: 1 }],
    levels: [{ id: "basic", name: "Basic", gradeRange: "1-3", order: 1 }],
    questionTypes: ["choice"],
    diagnostic: { rounds: 1, questionsPerRound: 1, strategy: "adaptive" },
    training: { sessionLength: 1, adaptiveWeights: { weak: 1, current: 1, review: 1 }, masteryThreshold: 0.8 }
  } as never);
  getLoadedQuestions().push(...Array.from({ length: 30 }, (_, index) => ({
    id: `m82-audit-question-${index + 1}`,
    moduleId: "m82-audit-module",
    skill: "addition",
    level: "basic",
    questionType: "multiple-choice",
    difficulty: 0.2 + (index % 3) * 0.1,
    prompt: `What is ${index + 2} + 3?`,
    choices: [{ key: "A", text: String(index + 5) }, { key: "B", text: String(index + 6) }],
    answerKey: "A",
    explanation: `${index + 2} + 3 = ${index + 5}`,
    estimatedTimeSec: 30
  })) as never);

  const suffix = randomUUID().slice(0, 8);
  const users = [
    { name: "M82 Student", email: `m82.student.${suffix}@example.test`, role: "student" },
    { name: "M82 Other Student", email: `m82.other.${suffix}@example.test`, role: "student" },
    { name: "M82 Parent", email: `m82.parent.${suffix}@example.test`, role: "parent" },
    { name: "M82 Teacher", email: `m82.teacher.${suffix}@example.test`, role: "teacher" }
  ];
  for (const user of users) {
    await User.create({ ...user, passwordHash: hashPassword("m82-test-password") });
  }

  const app = buildApp();
  await app.listen({ host: "127.0.0.1", port: 3300 });

  console.log(JSON.stringify({
    ready: true,
    api: "http://127.0.0.1:3300",
    mongo: process.env.MONGODB_URI,
    userSuffix: suffix,
    pid: process.pid,
  }));

  const shutdown = async () => {
    await app.close();
    await mongoose.disconnect();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
  await new Promise<void>(() => {});
}

void main();
