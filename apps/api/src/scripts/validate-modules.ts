import fs from "node:fs";
import path from "node:path";

/**
 * Validate module manifest structure against the expected schema.
 */
export interface ModuleManifest {
  id: string;
  name: string;
  version: string;
  subject: string;
  category: string;
  description: string;
  icon: string;
  color: string;
  targetAge: { min: number; max: number };
  skills: Array<{
    id: string;
    name: string;
    description: string;
    subSkills: string[];
    order: number;
  }>;
  levels: Array<{
    id: string;
    name: string;
    gradeRange: string;
    order: number;
  }>;
  questionTypes: string[];
  diagnostic: {
    rounds: number;
    questionsPerRound: number;
    strategy: string;
  };
  training: {
    sessionLength: number;
    adaptiveWeights: Record<string, number>;
    masteryThreshold: number;
  };
}

export function validateManifest(manifestPath: string): ModuleManifest {
  const raw = fs.readFileSync(manifestPath, "utf-8");
  const manifest = JSON.parse(raw) as ModuleManifest;

  // Required fields
  const required = ["id", "name", "version", "subject", "description", "skills", "levels"];
  for (const field of required) {
    if (!(field in manifest)) {
      throw new Error(`[validate] Missing required field "${field}" in ${manifestPath}`);
    }
  }

  // Validate skills
  if (!Array.isArray(manifest.skills) || manifest.skills.length === 0) {
    throw new Error(`[validate] Module ${manifest.id} must have at least one skill`);
  }
  for (const skill of manifest.skills) {
    if (!skill.id || !skill.name || !Array.isArray(skill.subSkills)) {
      throw new Error(`[validate] Invalid skill in ${manifest.id}: ${JSON.stringify(skill)}`);
    }
  }

  // Validate levels
  if (!Array.isArray(manifest.levels) || manifest.levels.length === 0) {
    throw new Error(`[validate] Module ${manifest.id} must have at least one level`);
  }

  return manifest;
}

export function validateSeeds(moduleDir: string, manifest: ModuleManifest): void {
  const seedsDir = path.join(moduleDir, "seeds");
  if (!fs.existsSync(seedsDir)) {
    throw new Error(`[validate] Seeds directory not found: ${seedsDir}`);
  }

  const seedFiles = fs.readdirSync(seedsDir).filter((f) => f.endsWith(".json"));
  const manifestLevelIds = new Set(manifest.levels.map((l) => l.id));

  for (const file of seedFiles) {
    const levelId = path.basename(file, ".json");
    if (!manifestLevelIds.has(levelId)) {
      console.warn(`[validate] Seed file "${file}" does not match any level in manifest`);
    }

    const content = JSON.parse(fs.readFileSync(path.join(seedsDir, file), "utf-8"));
    if (!Array.isArray(content)) {
      throw new Error(`[validate] Seed file ${file} must be a JSON array`);
    }

    for (const question of content) {
      if (!question.id || !question.skill || !question.prompt) {
        throw new Error(`[validate] Invalid question in ${file}: ${JSON.stringify(question.id)}`);
      }
      if (question.moduleId !== manifest.id) {
        throw new Error(`[validate] Question ${question.id} has wrong moduleId`);
      }
    }

    console.debug(`[validate] ${file}: ${content.length} questions validated`);
  }
}
