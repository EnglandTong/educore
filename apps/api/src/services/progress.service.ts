import type { MasteryLevel, ProgressOverview, SkillMastery as SkillMasteryDTO } from "@educore/types";

import { getRedis } from "../config/redis.js";
import { SkillMastery } from "../models/SkillMastery.js";
import { getLoadedModules } from "./moduleLoader.js";

const PROGRESS_CACHE_TTL_SECONDS = 30;

function toLevel(score: number): MasteryLevel {
  if (score < 30) return "seedling";
  if (score < 50) return "growing";
  if (score < 70) return "developing";
  if (score < 85) return "proficient";
  if (score < 95) return "advanced";
  return "mastered";
}

function progressCacheKey(studentId: string): string {
  return `progress:${studentId}`;
}

export async function getSkillMasteryList(studentId: string, moduleId?: string): Promise<SkillMasteryDTO[]> {
  const docs = await SkillMastery.find(moduleId ? { studentId, moduleId } : { studentId }).lean();
  return docs.map((doc: any) => ({
    studentId: String(doc.studentId),
    moduleId: doc.moduleId,
    skillId: doc.skillId,
    skillName: doc.skillName,
    score: doc.score,
    level: doc.level,
    streak: doc.streak,
    totalAttempts: doc.totalAttempts,
    correctAttempts: doc.correctAttempts,
    lastPracticedAt: doc.lastPracticedAt ? new Date(doc.lastPracticedAt).toISOString() : undefined,
    nextReviewAt: doc.nextReviewAt ? new Date(doc.nextReviewAt).toISOString() : undefined
  }));
}

export async function getProgressOverview(studentId: string): Promise<ProgressOverview> {
  const redis = getRedis();
  try {
    const cached = await redis.get(progressCacheKey(studentId));
    if (cached) {
      return JSON.parse(cached) as ProgressOverview;
    }
  } catch {
    // Cache is best-effort. If Redis is unavailable, continue with the live query.
  }

  const masteries = await SkillMastery.find({ studentId }).lean();
  const modules = getLoadedModules().map((module) => {
    const moduleMasteries = masteries.filter((mastery: any) => mastery.moduleId === module.id);
    const overallScore = moduleMasteries.length > 0
      ? Math.round(moduleMasteries.reduce((sum: number, mastery: any) => sum + mastery.score, 0) / moduleMasteries.length)
      : 0;
    const masteredCount = moduleMasteries.filter((mastery: any) => mastery.score >= 95).length;

    return {
      moduleId: module.id,
      moduleName: module.name,
      overallScore,
      overallLevel: toLevel(overallScore),
      skillCount: module.skills.length,
      masteredCount,
      lastActivityAt: moduleMasteries
        .map((mastery: any) => mastery.lastPracticedAt ? new Date(mastery.lastPracticedAt) : null)
        .filter((date: Date | null): date is Date => Boolean(date))
        .sort((a: Date, b: Date) => b.getTime() - a.getTime())[0]?.toISOString()
    };
  });

  const overview: ProgressOverview = {
    studentId,
    modules,
    totalXP: masteries.reduce((sum: number, mastery: any) => sum + mastery.score, 0),
    currentStreak: masteries.reduce((sum: number, mastery: any) => sum + (mastery.streak?.current ?? 0), 0),
    longestStreak: masteries.reduce((max: number, mastery: any) => Math.max(max, mastery.streak?.best ?? 0), 0)
  };

  try {
    await redis.set(progressCacheKey(studentId), JSON.stringify(overview), "EX", PROGRESS_CACHE_TTL_SECONDS);
  } catch {
    // Ignore cache write failures.
  }
  return overview;
}

export async function getProgressTimeline(studentId: string, moduleId?: string) {
  const docs = await SkillMastery.find(moduleId ? { studentId, moduleId } : { studentId }).lean();
  return docs.map((doc: any) => ({
    skillId: doc.skillId,
    score: doc.score,
    level: doc.level,
    lastPracticedAt: doc.lastPracticedAt ? new Date(doc.lastPracticedAt).toISOString() : undefined,
    nextReviewAt: doc.nextReviewAt ? new Date(doc.nextReviewAt).toISOString() : undefined
  }));
}

export async function invalidateProgressOverview(studentId: string): Promise<void> {
  try {
    await getRedis().del(progressCacheKey(studentId));
  } catch {
    // Ignore cache invalidation failures.
  }
}
