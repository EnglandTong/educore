import type { QuestionType } from "./question.js";

export interface ModuleSkill {
  id: string;
  name: string;
  description: string;
  subSkills: string[];
  order: number;
}

export interface ModuleLevel {
  id: string;
  name: string;
  gradeRange: string;
  order: number;
}

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
  skills: ModuleSkill[];
  levels: ModuleLevel[];
  questionTypes: QuestionType[];
  diagnostic: {
    rounds: number;
    questionsPerRound: number;
    strategy: "adaptive";
  };
  training: {
    sessionLength: number;
    adaptiveWeights: { weak: number; current: number; review: number };
    masteryThreshold: number;
  };
}
