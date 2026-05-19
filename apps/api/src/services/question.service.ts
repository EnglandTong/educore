import type { Question as SharedQuestion, QuestionType } from "@educore/types";

import { Question } from "../models/Question.js";
import { getLoadedModules, getLoadedQuestions } from "./moduleLoader.js";

export interface QuestionQuery {
  moduleId?: string;
  skillId?: string;
  questionType?: QuestionType;
  excludeIds?: string[];
  limit?: number;
}

export interface QuestionChoice {
  key: string;
  text: string;
}

export interface ServedQuestion {
  id: string;
  moduleId: string;
  skill: string;
  subSkill?: string;
  level: string;
  questionType: QuestionType;
  difficulty: number;
  prompt: string;
  choices?: QuestionChoice[];
  answerKey: string | string[];
  explanation: string;
  explanationSteps?: string[];
  hints?: string[];
  wrongChoiceReasons?: Record<string, string>;
  tags?: string[];
  estimatedTimeSec?: number;
}

function normalizeQuestion(question: SharedQuestion): ServedQuestion {
  return {
    id: question.id,
    moduleId: question.moduleId,
    skill: question.skill,
    subSkill: question.subSkill,
    level: question.level,
    questionType: question.questionType,
    difficulty: question.difficulty,
    prompt: question.prompt,
    choices: question.choices,
    answerKey: question.answerKey,
    explanation: question.explanation,
    explanationSteps: question.explanationSteps,
    hints: question.hints,
    wrongChoiceReasons: question.wrongChoiceReasons,
    tags: question.tags,
    estimatedTimeSec: question.estimatedTimeSec
  };
}

export async function listQuestions(query: QuestionQuery = {}): Promise<ServedQuestion[]> {
  const filter: Record<string, unknown> = {};
  if (query.moduleId) filter.moduleId = query.moduleId;
  if (query.skillId) filter.skill = query.skillId;
  if (query.questionType) filter.questionType = query.questionType;
  if (query.excludeIds?.length) filter._id = { $nin: query.excludeIds };

  const docs = await Question.find(filter).sort({ difficulty: 1, updatedAt: -1 }).limit(query.limit ?? 20);
  const dbQuestions = docs.map((doc: any) => ({
    id: String(doc._id),
    moduleId: doc.moduleId,
    skill: doc.skill,
    subSkill: doc.subSkill,
    level: doc.level,
    questionType: doc.questionType as QuestionType,
    difficulty: doc.difficulty,
    prompt: doc.prompt,
    choices: doc.choices,
    answerKey: doc.answerKey,
    explanation: doc.explanation,
    explanationSteps: doc.explanationSteps,
    hints: doc.hints,
    wrongChoiceReasons: doc.wrongChoiceReasons,
    tags: doc.tags,
    estimatedTimeSec: doc.estimatedTimeSec
  }));

  if (dbQuestions.length > 0) {
    return dbQuestions;
  }

  return getLoadedQuestions()
    .filter((question) => {
      if (query.moduleId && question.moduleId !== query.moduleId) return false;
      if (query.skillId && question.skill !== query.skillId) return false;
      if (query.questionType && question.questionType !== query.questionType) return false;
      if (query.excludeIds?.includes(question.id)) return false;
      return true;
    })
    .slice(0, query.limit ?? 20)
    .map(normalizeQuestion);
}

export async function getQuestionById(questionId: string): Promise<ServedQuestion | null> {
  const doc = await Question.findById(questionId);
  if (doc) {
    const value = doc.toObject() as any;
    return {
      id: String(value._id),
      moduleId: value.moduleId,
      skill: value.skill,
      subSkill: value.subSkill,
      level: value.level,
      questionType: value.questionType as QuestionType,
      difficulty: value.difficulty,
      prompt: value.prompt,
      choices: value.choices,
      answerKey: value.answerKey,
      explanation: value.explanation,
      explanationSteps: value.explanationSteps,
      hints: value.hints,
      wrongChoiceReasons: value.wrongChoiceReasons,
      tags: value.tags,
      estimatedTimeSec: value.estimatedTimeSec
    };
  }

  const memory = getLoadedQuestions().find((question) => question.id === questionId);
  return memory ? normalizeQuestion(memory) : null;
}

export function getQuestionModuleName(moduleId: string): string {
  return getLoadedModules().find((module) => module.id === moduleId)?.name ?? moduleId;
}

export function getModuleManifest(moduleId: string) {
  return getLoadedModules().find((module) => module.id === moduleId) ?? null;
}
