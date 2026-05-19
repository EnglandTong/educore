import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import type { ModuleManifest, Question } from "@educore/types";
import mongoose from "mongoose";
import { z } from "zod";

import { Module } from "../models/Module.js";
import { Question as QuestionModel } from "../models/Question.js";

const skillSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().default(""),
  subSkills: z.array(z.string()).default([]),
  order: z.number().int()
});

const manifestSchema = z.object({
  id: z.string(),
  name: z.string(),
  version: z.string(),
  subject: z.string(),
  category: z.string(),
  description: z.string(),
  icon: z.string(),
  color: z.string(),
  targetAge: z.object({ min: z.number(), max: z.number() }),
  skills: z.array(skillSchema),
  levels: z.array(z.object({ id: z.string(), name: z.string(), gradeRange: z.string(), order: z.number().int() })),
  questionTypes: z.array(z.string()),
  diagnostic: z.object({ rounds: z.number().int(), questionsPerRound: z.number().int(), strategy: z.literal("adaptive") }),
  training: z.object({
    sessionLength: z.number().int(),
    adaptiveWeights: z.object({ weak: z.number(), current: z.number(), review: z.number() }),
    masteryThreshold: z.number()
  })
});

const questionSchema = z.object({
  id: z.string(),
  moduleId: z.string(),
  skill: z.string(),
  subSkill: z.string().optional(),
  level: z.string(),
  questionType: z.string(),
  difficulty: z.number(),
  prompt: z.string(),
  choices: z.array(z.object({ key: z.string(), text: z.string() })).optional(),
  answerKey: z.union([z.string(), z.array(z.string())]),
  explanation: z.string(),
  explanationSteps: z.array(z.string()).optional(),
  hints: z.array(z.string()).optional(),
  wrongChoiceReasons: z.record(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  estimatedTimeSec: z.number().optional()
});

const modulesRoot = (() => {
  // When running from apps/api/ process.cwd() is inside the package dir.
  // When running from project root it is the repo root.
  // Check both locations to find the shared modules/ directory.
  const candidates = [
    path.resolve(process.cwd(), "modules"),
    path.resolve(process.cwd(), "..", "..", "modules")
  ];
  return candidates.find((candidate) => existsSync(candidate)) ?? candidates[0]!;
})();
const loadedModules: ModuleManifest[] = [];
const loadedQuestions: Question[] = [];

export function getLoadedModules(): ModuleManifest[] {
  return loadedModules;
}

export function getLoadedQuestions(): Question[] {
  return loadedQuestions;
}

export async function loadModules(): Promise<void> {
  loadedModules.length = 0;
  loadedQuestions.length = 0;

  if (!existsSync(modulesRoot)) {
    return;
  }

  const entries = await readdir(modulesRoot, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const moduleDir = path.join(modulesRoot, entry.name);
    const manifestPath = path.join(moduleDir, "manifest.json");
    if (!existsSync(manifestPath)) {
      continue;
    }

    const manifestJson = JSON.parse(await readFile(manifestPath, "utf8")) as unknown;
    const manifest = manifestSchema.parse(manifestJson) as ModuleManifest;
    loadedModules.push(manifest);
    if (mongoose.connection.readyState === 1) {
      await Module.updateOne(
        { _id: manifest.id },
        { $set: { ...manifest, _id: manifest.id } },
        { upsert: true }
      );
    }

    const seedsDir = path.join(moduleDir, "seeds");
    if (!existsSync(seedsDir)) {
      continue;
    }

    const seedFiles = await readdir(seedsDir);
    for (const seedFile of seedFiles.filter((file) => file.endsWith(".json"))) {
      const raw = await readFile(path.join(seedsDir, seedFile), "utf8");
      const seedJson = JSON.parse(raw) as unknown;
      if (!Array.isArray(seedJson)) {
        console.warn(`[moduleLoader] Skipping non-array seed file: ${seedFile} in ${entry.name}`);
        continue;
      }
      const questions = z.array(questionSchema).parse(seedJson) as Question[];
      const existingIds = new Set(loadedQuestions.map((question) => question.id));
      const uniqueQuestions = questions.filter((question) => {
        if (existingIds.has(question.id)) {
          return false;
        }
        existingIds.add(question.id);
        return true;
      });
      loadedQuestions.push(...uniqueQuestions);
      if (mongoose.connection.readyState === 1 && uniqueQuestions.length > 0) {
        await QuestionModel.bulkWrite(
          uniqueQuestions.map((question) => ({
            updateOne: {
              filter: { _id: question.id },
              update: { $setOnInsert: { ...question, _id: question.id } },
              upsert: true
            }
          }))
        );
      }
    }
  }
}
