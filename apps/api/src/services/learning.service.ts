import type { DiagnosticReport, SessionReport, SkillScore } from "@educore/types";
import { ENGLISH_GRAMMAR_MODULE_ID } from "@educore/constants";
import { calculateMasteryScore, calculateNextReview, estimateAbility, selectDiagnosticQuestion, selectNextQuestion, updateBKT } from "@educore/algorithms";

import { LearningSession as LearningSessionModel } from "../models/LearningSession.js";
import type { ILearningSessionDocument } from "../models/LearningSession.js";
import { Question } from "../models/Question.js";
import { SkillMastery } from "../models/SkillMastery.js";
import { WrongAnswer } from "../models/WrongAnswer.js";
import type { IWrongAnswerDocument } from "../models/WrongAnswer.js";
import { AppError } from "../utils/errors.js";
import { selectWarmFeedback } from "./feedbackSelector.js";
import { getLoadedModules } from "./moduleLoader.js";
import { getModuleManifest, getQuestionById, listQuestions, ServedQuestion } from "./question.service.js";
import { invalidateProgressOverview } from "./progress.service.js";

export interface LearningSessionRecord {
  id: string;
  studentId: string;
  moduleId: string;
  type: "diagnostic" | "training" | "review" | "challenge";
  status: "active" | "completed" | "abandoned";
  currentQuestionIndex: number;
  totalQuestions: number;
  correctCount: number;
  startedAt: string;
  completedAt?: string;
}

export interface AnswerInput {
  sessionId: string;
  questionId: string;
  answer: string | string[];
  timeSpent?: number;
  hintsUsed?: number;
}

export interface AnswerResult {
  isCorrect: boolean;
  feedback: string;
  explanation: string;
  mastery?: SkillScore & { nextReviewAt?: string };
}

export interface WrongAnswerRecordDTO {
  id: string;
  studentId: string;
  questionId: string;
  question: ServedQuestion;
  studentAnswer: string;
  correctAnswer: string;
  explanation: string;
  createdAt: string;
  reviewStatus: "pending" | "reviewing" | "mastered";
  nextReviewAt?: string;
  reviewCount: number;
}

type SessionType = LearningSessionRecord["type"];

function toAnswerText(answer: string | string[]): string {
  return Array.isArray(answer) ? answer.join(",") : answer;
}

function sessionRecord(session: ILearningSessionDocument): LearningSessionRecord {
  const answered = Array.isArray(session.questions) ? session.questions.filter((q) => q.answered).length : 0;
  return {
    id: String(session._id),
    studentId: String(session.studentId),
    moduleId: session.moduleId,
    type: session.type,
    status: session.status,
    currentQuestionIndex: answered,
    totalQuestions: session.config?.totalQuestions ?? answered,
    correctCount: session.stats?.correctCount ?? 0,
    startedAt: session.startedAt instanceof Date ? session.startedAt.toISOString() : new Date(session.startedAt).toISOString(),
    completedAt: session.completedAt ? new Date(session.completedAt).toISOString() : undefined
  };
}

function wrongAnswerRecord(doc: IWrongAnswerDocument, question: ServedQuestion): WrongAnswerRecordDTO {
  return {
    id: String(doc._id),
    studentId: String(doc.studentId),
    questionId: doc.questionId,
    question,
    studentAnswer: doc.studentAnswer,
    correctAnswer: doc.correctAnswer,
    explanation: doc.explanation,
    createdAt: new Date(doc.createdAt ?? new Date()).toISOString(),
    reviewStatus: doc.reviewStatus,
    nextReviewAt: doc.nextReviewAt ? new Date(doc.nextReviewAt).toISOString() : undefined,
    reviewCount: doc.reviewCount ?? 0
  };
}

async function ensureMastery(studentId: string, moduleId: string, skillId: string, skillName: string) {
  const existing = await SkillMastery.findOne({ studentId, moduleId, skillId });
  if (existing) {
    return existing;
  }

  return SkillMastery.create({
    studentId,
    moduleId,
    skillId,
    skillName
  });
}

async function moduleSkills(moduleId: string): Promise<Array<{ id: string; name: string }>> {
  return getModuleManifest(moduleId)?.skills.map((skill: { id: string; name: string }) => ({ id: skill.id, name: skill.name })) ?? [];
}

async function buildSkillState(studentId: string, moduleId: string): Promise<Array<{ skillId: string; score: number; level: string; lastPracticedAt?: string; nextReviewAt?: string }>> {
  const docs = await SkillMastery.find({ studentId, moduleId }).lean();
  if (docs.length > 0) {
    return docs.map((doc) => ({
      skillId: doc.skillId,
      score: doc.score,
      level: doc.level,
      lastPracticedAt: doc.lastPracticedAt ? new Date(doc.lastPracticedAt).toISOString() : undefined,
      nextReviewAt: doc.nextReviewAt ? new Date(doc.nextReviewAt).toISOString() : undefined
    }));
  }

  return moduleSkills(moduleId).then((skills) => skills.map((skill) => ({
    skillId: skill.id,
    score: 0,
    level: "seedling"
  })));
}

async function updateQuestionStats(questionId: string, isCorrect: boolean, timeSpent?: number): Promise<void> {
  const question = await Question.findById(questionId);
  if (!question) {
    return;
  }

  const totalAttempts = (question.stats?.totalAttempts ?? 0) + 1;
  const correctCount = (question.stats?.correctCount ?? 0) + (isCorrect ? 1 : 0);
  const previousAvg = question.stats?.avgTimeSec ?? 0;
  const avgTimeSec = typeof timeSpent === "number" ? ((previousAvg * (totalAttempts - 1)) + timeSpent) / totalAttempts : previousAvg;

  question.stats = { totalAttempts, correctCount, avgTimeSec };
  await question.save();
}

async function saveWrongAnswer(studentId: string, question: ServedQuestion, answerText: string, reviewCount = 0): Promise<void> {
  const reviewSchedule = calculateNextReview(reviewCount, false);
  await WrongAnswer.findOneAndUpdate(
    { studentId, questionId: question.id },
    {
      $set: {
        studentAnswer: answerText,
        correctAnswer: Array.isArray(question.answerKey) ? question.answerKey.join(",") : question.answerKey,
        explanation: question.explanation,
        reviewStatus: "pending",
        nextReviewAt: reviewSchedule.nextReviewAt
      },
      $setOnInsert: {
        studentId,
        questionId: question.id,
        moduleId: question.moduleId,
        skillId: question.skill,
        reviewCount
      }
    },
    { upsert: true, new: true }
  );
}

async function updateMastery(studentId: string, question: ServedQuestion, isCorrect: boolean, timeSpent?: number): Promise<SkillScore & { nextReviewAt?: string }> {
  const mastery = await ensureMastery(studentId, question.moduleId, question.skill, question.skill);
  const nextBkt = updateBKT(
    {
      pKnown: mastery.bktParams?.pKnown ?? 0.2,
      pLearn: mastery.bktParams?.pLearn ?? 0.1,
      pSlip: mastery.bktParams?.pSlip ?? 0.1,
      pGuess: mastery.bktParams?.pGuess ?? 0.25
    },
    isCorrect
  );

  const recentAnswers = [...(mastery.recentAnswers ?? []), isCorrect].slice(-10);
  const streak = isCorrect ? (mastery.streak?.current ?? 0) + 1 : 0;
  const best = Math.max(mastery.streak?.best ?? 0, streak);
  const scoreResult = calculateMasteryScore(nextBkt.pKnown, recentAnswers, streak, (mastery.totalAttempts ?? 0) + 1);
  const schedule = calculateNextReview(mastery.totalAttempts ?? 0, isCorrect);

  mastery.bktParams = {
    pKnown: nextBkt.pKnown,
    pLearn: mastery.bktParams?.pLearn ?? 0.1,
    pSlip: mastery.bktParams?.pSlip ?? 0.1,
    pGuess: mastery.bktParams?.pGuess ?? 0.25
  };
  mastery.score = scoreResult.score;
  mastery.level = scoreResult.level;
  mastery.streak = { current: streak, best };
  mastery.totalAttempts = (mastery.totalAttempts ?? 0) + 1;
  mastery.correctAttempts = (mastery.correctAttempts ?? 0) + (isCorrect ? 1 : 0);
  mastery.recentAnswers = recentAnswers;
  mastery.lastPracticedAt = new Date();
  mastery.nextReviewAt = schedule.nextReviewAt;
  await mastery.save();

  await updateQuestionStats(question.id, isCorrect, timeSpent);
  if (!isCorrect) {
    await saveWrongAnswer(studentId, question, toAnswerText(question.answerKey));
  }

  return {
    skillId: question.skill,
    skillName: question.skill,
    score: scoreResult.score,
    level: scoreResult.level,
    questionsAttempted: mastery.totalAttempts,
    questionsCorrect: mastery.correctAttempts,
    nextReviewAt: schedule.nextReviewAt.toISOString()
  };
}

async function createSession(studentId: string, moduleId: string, type: SessionType, totalQuestions: number) {
  return LearningSessionModel.create({
    studentId,
    moduleId,
    type,
    status: "active",
    config: { totalQuestions },
    questions: [],
    stats: { correctCount: 0, totalAnswered: 0, averageTime: 0 },
    startedAt: new Date()
  });
}

async function activeSession(studentId: string, type: SessionType) {
  return LearningSessionModel.findOne({ studentId, type, status: "active" }).sort({ createdAt: -1 });
}

async function latestSession(studentId: string, type: SessionType) {
  return LearningSessionModel.findOne({ studentId, type }).sort({ createdAt: -1 });
}

async function chooseQuestion(session: ILearningSessionDocument, studentId: string): Promise<ServedQuestion> {
  const seenIds = Array.isArray(session.questions) ? session.questions.map((q) => q.questionId) : [];
  const questions = await listQuestions({
    moduleId: session.moduleId,
    excludeIds: seenIds,
    limit: 200
  });

  if (questions.length === 0) {
    throw new AppError(404, "NOT_FOUND", "We do not have any questions loaded for this module yet.");
  }

  if (session.type === "diagnostic") {
    const answered = Array.isArray(session.questions) ? session.questions.filter((q) => q.answered) : [];
    const criteria = selectDiagnosticQuestion(
      1,
      answered.length + 1,
      answered.map((q) => Boolean(q.isCorrect)),
      answered.map((q, index) => ({
        skillId: q.questionId ?? `skill-${index}`,
        correct: Boolean(q.isCorrect),
        difficulty: 0.5
      })),
      0.5
    );
    return questions.find((q) => q.difficulty >= criteria.difficultyRange[0] && q.difficulty <= criteria.difficultyRange[1]) ?? questions[0]!;
  }

  const masteries = await buildSkillState(studentId, session.moduleId);
  const estimatedAbility = estimateAbility(
    (Array.isArray(session.questions) ? session.questions : [])
      .filter((q) => q.answered)
      .map((q) => ({
        params: { difficulty: 0.5, discrimination: 1 },
        correct: Boolean(q.isCorrect)
      }))
  );
  const selection = selectNextQuestion(
    masteries,
    seenIds,
    [],
    undefined,
    estimatedAbility
  );

  const preferred = questions.filter((q) => {
    if (q.skill !== selection.skillId) return false;
    if (q.difficulty < selection.difficultyRange[0] || q.difficulty > selection.difficultyRange[1]) return false;
    if (selection.preferredTypes && !selection.preferredTypes.includes(q.questionType)) return false;
    return true;
  });

  return preferred[0] ?? questions[0]!;
}

export async function startLearningSession(studentId: string, type: SessionType, moduleId?: string): Promise<{ session: LearningSessionRecord }> {
  const selectedModule = moduleId ?? getLoadedModules()[0]?.id ?? ENGLISH_GRAMMAR_MODULE_ID;
  const totalQuestions = type === "diagnostic" ? 25 : 30;
  const session = await createSession(studentId, selectedModule, type, totalQuestions);
  return { session: sessionRecord(session) };
}

export async function getNextLearningQuestion(studentId: string, type: SessionType): Promise<{ session: LearningSessionRecord; question: ServedQuestion }> {
  const session = await activeSession(studentId, type);
  if (!session) {
    throw new AppError(404, "NOT_FOUND", "We could not find an active session yet. Start one and we can continue together.");
  }

  const unanswered = Array.isArray(session.questions) ? session.questions.find((q) => !q.answered) : undefined;
  if (unanswered) {
    const question = await getQuestionById(String(unanswered.questionId));
    if (!question) {
      throw new AppError(404, "NOT_FOUND", "We could not find the next question yet. Let's try another one.");
    }
    return { session: sessionRecord(session), question };
  }

  const question = await chooseQuestion(session, studentId);
  session.questions.push({ questionId: question.id, answered: false });
  await session.save();
  return { session: sessionRecord(session), question };
}

export async function submitLearningAnswer(studentId: string, input: AnswerInput): Promise<AnswerResult> {
  const session = await LearningSessionModel.findOne({ _id: input.sessionId, studentId, status: "active" });
  if (!session) {
    throw new AppError(404, "NOT_FOUND", "We could not find that session. Please start a new one and we can keep going.");
  }

  const question = await getQuestionById(input.questionId);
  if (!question) {
    throw new AppError(404, "NOT_FOUND", "We could not find that question yet. Let's try another one.");
  }

  const sessionQuestion = session.questions.find((entry) => entry.questionId === input.questionId);
  if (!sessionQuestion) {
    throw new AppError(409, "CONFLICT", "That question is not part of this session. Let's try the current step.");
  }
  if (sessionQuestion.answered) {
    throw new AppError(409, "CONFLICT", "That question already has an answer. Let's move to the next one.");
  }

  const answerText = toAnswerText(input.answer).trim();
  const answerKey = Array.isArray(question.answerKey) ? question.answerKey.join(",") : question.answerKey;
  const isCorrect = answerText.toLowerCase() === String(answerKey).toLowerCase();

  sessionQuestion.answered = true;
  sessionQuestion.studentAnswer = answerText;
  sessionQuestion.isCorrect = isCorrect;
  sessionQuestion.timeSpent = input.timeSpent;
  sessionQuestion.hintsUsed = input.hintsUsed;

  session.stats.correctCount += isCorrect ? 1 : 0;
  session.stats.totalAnswered += 1;
  if (typeof input.timeSpent === "number") {
    session.stats.averageTime = ((session.stats.averageTime ?? 0) * (session.stats.totalAnswered - 1) + input.timeSpent) / session.stats.totalAnswered;
  }

  if (session.stats.totalAnswered >= session.config.totalQuestions) {
    session.status = "completed";
    session.completedAt = new Date();
  }

  await session.save();

  const mastery = await updateMastery(studentId, question, isCorrect, input.timeSpent);
  await invalidateProgressOverview(studentId);
  if (!isCorrect) {
    await saveWrongAnswer(studentId, question, answerText);
  }

  return {
    isCorrect,
    feedback: selectWarmFeedback(isCorrect ? "correct" : "notQuite"),
    explanation: question.explanation,
    mastery
  };
}

export async function endLearningSession(studentId: string, type: SessionType): Promise<SessionReport> {
  const session = await latestSession(studentId, type);
  if (!session) {
    throw new AppError(404, "NOT_FOUND", "We could not find a session to close yet.");
  }

  session.status = "completed";
  session.completedAt = new Date();
  await session.save();

  const answered = Array.isArray(session.questions) ? session.questions.filter((q) => q.answered) : [];
  const correctCount = answered.filter((q) => q.isCorrect).length;
  const totalQuestions = session.config?.totalQuestions ?? answered.length;

  return {
    sessionId: String(session._id),
    accuracy: totalQuestions > 0 ? correctCount / totalQuestions : 0,
    totalQuestions,
    correctCount,
    timeSpent: (session.stats?.averageTime ?? 0) * (session.stats?.totalAnswered ?? 0),
    skillBreakdown: answered.map((q) => ({
      skill: q.questionId ?? "unknown",
      correct: q.isCorrect ? 1 : 0,
      total: 1
    })),
    strengths: [],
    growthAreas: [],
    levelEstimate: undefined,
    encouragement: "You kept going, and that effort matters. Let's build on it next time."
  };
}

export async function getDiagnosticReport(studentId: string): Promise<DiagnosticReport> {
  const session = await latestSession(studentId, "diagnostic");
  if (!session) {
    throw new AppError(404, "NOT_FOUND", "We could not find your diagnostic session yet.");
  }

  const answered = Array.isArray(session.questions) ? session.questions.filter((q) => q.answered) : [];
  const result = calculateMasteryScore(
    answered.length > 0 ? answered.filter((q) => q.isCorrect).length / answered.length : 0,
    answered.map((q) => Boolean(q.isCorrect)),
    answered.filter((q) => q.isCorrect).length,
    answered.length
  );

  return {
    sessionId: String(session._id),
    estimatedLevel: result.level,
    skillScores: [],
    strengths: [],
    weaknesses: [],
    nextSteps: [],
    encouragement: "You collected solid evidence about your skills. We can use that to guide the next round."
  };
}

export async function getLearningSessionSnapshot(studentId: string, type: SessionType): Promise<LearningSessionRecord | null> {
  const session = await activeSession(studentId, type);
  return session ? sessionRecord(session) : null;
}

export async function listWrongAnswers(studentId: string, dueOnly = false): Promise<WrongAnswerRecordDTO[]> {
  const query: Record<string, unknown> = { studentId };
  if (dueOnly) {
    query.$or = [
      { nextReviewAt: { $exists: false } },
      { nextReviewAt: { $lte: new Date() } }
    ];
  }

  const docs = await WrongAnswer.find(query).sort({ createdAt: -1 }).lean();

  // Batch query all questions at once — eliminates N+1
  const questionIds = docs.map((doc) => String(doc.questionId));
  const questions = await Question.find({ _id: { $in: questionIds } }).lean();
  const questionMap = new Map(questions.map((q) => [String(q._id), q]));

  const records: WrongAnswerRecordDTO[] = [];
  for (const doc of docs) {
    const question = questionMap.get(String(doc.questionId));
    if (!question) {
      continue;
    }
    records.push(wrongAnswerRecord(doc, question as unknown as ServedQuestion));
  }
  return records;
}

async function wrongAnswerSession(studentId: string, type: "review" | "challenge") {
  const wrongAnswers = await listWrongAnswers(studentId, type === "review");
  const moduleId = wrongAnswers[0]?.question.moduleId ?? getLoadedModules()[0]?.id ?? ENGLISH_GRAMMAR_MODULE_ID;
  const totalQuestions = type === "challenge" ? Math.min(6, Math.max(2, wrongAnswers.length)) : Math.min(10, Math.max(1, wrongAnswers.length));

  const session = await LearningSessionModel.create({
    studentId,
    moduleId,
    type,
    status: "active",
    config: { totalQuestions },
    questions: wrongAnswers.slice(0, totalQuestions).map((record) => ({
      questionId: record.questionId,
      answered: false
    })),
    stats: { correctCount: 0, totalAnswered: 0, averageTime: 0 },
    startedAt: new Date()
  });

  return { session: sessionRecord(session), wrongAnswers };
}

export async function startReviewSession(studentId: string) {
  return wrongAnswerSession(studentId, "review");
}

export async function startChallengeSession(studentId: string) {
  const masteries = await SkillMastery.find({ studentId }).lean();
  const proficientSkills = masteries.filter((mastery) => mastery.score >= 70);
  if (proficientSkills.length < 3) {
    throw new AppError(409, "CONFLICT", "You're very close. Build a little more mastery before the challenge opens.");
  }
  const selectedSkills = proficientSkills.slice(0, 3);
  const moduleId = selectedSkills[0]?.moduleId ?? getLoadedModules()[0]?.id ?? ENGLISH_GRAMMAR_MODULE_ID;

  const chosenQuestions: ServedQuestion[] = [];
  for (const mastery of selectedSkills) {
    const questions = await listQuestions({
      moduleId: mastery.moduleId,
      skillId: mastery.skillId,
      limit: 2,
      excludeIds: chosenQuestions.map((q) => q.id)
    });
    chosenQuestions.push(...questions.slice(0, 2));
  }

  const totalQuestions = Math.min(6, Math.max(2, chosenQuestions.length));
  const session = await LearningSessionModel.create({
    studentId,
    moduleId,
    type: "challenge",
    status: "active",
    config: { totalQuestions },
    questions: chosenQuestions.slice(0, totalQuestions).map((record) => ({
      questionId: record.id,
      answered: false
    })),
    stats: { correctCount: 0, totalAnswered: 0, averageTime: 0 },
    startedAt: new Date()
  });

  return { session: sessionRecord(session), questions: chosenQuestions.slice(0, totalQuestions) };
}

export async function getNextWrongAnswerSessionQuestion(studentId: string, type: "review" | "challenge") {
  const session = await activeSession(studentId, type);
  if (!session) {
    throw new AppError(404, "NOT_FOUND", "We could not find an active session yet. Start one and we can continue together.");
  }

  const sessionQuestion = session.questions.find((entry) => !entry.answered);
  if (!sessionQuestion) {
    throw new AppError(404, "NOT_FOUND", "There is no next question waiting right now.");
  }

  const question = await getQuestionById(String(sessionQuestion.questionId));
  if (!question) {
    throw new AppError(404, "NOT_FOUND", "We could not find the next question yet. Let's try another one.");
  }

  return { session: sessionRecord(session), question };
}

export async function answerWrongAnswerSessionQuestion(studentId: string, input: AnswerInput, type: "review" | "challenge"): Promise<AnswerResult> {
  const session = await LearningSessionModel.findOne({ _id: input.sessionId, studentId, status: "active", type });
  if (!session) {
    throw new AppError(404, "NOT_FOUND", "We could not find that session. Please start a new one and we can keep going.");
  }

  const question = await getQuestionById(input.questionId);
  if (!question) {
    throw new AppError(404, "NOT_FOUND", "We could not find that question yet. Let's try another one.");
  }

  const sessionQuestion = session.questions.find((entry) => entry.questionId === input.questionId);
  if (!sessionQuestion) {
    throw new AppError(409, "CONFLICT", "That question is not part of this session. Let's try the current step.");
  }
  if (sessionQuestion.answered) {
    throw new AppError(409, "CONFLICT", "That question already has an answer. Let's move to the next one.");
  }

  const answerText = toAnswerText(input.answer).trim();
  const answerKey = Array.isArray(question.answerKey) ? question.answerKey.join(",") : question.answerKey;
  const isCorrect = answerText.toLowerCase() === String(answerKey).toLowerCase();

  sessionQuestion.answered = true;
  sessionQuestion.studentAnswer = answerText;
  sessionQuestion.isCorrect = isCorrect;
  sessionQuestion.timeSpent = input.timeSpent;
  sessionQuestion.hintsUsed = input.hintsUsed;
  session.stats.correctCount += isCorrect ? 1 : 0;
  session.stats.totalAnswered += 1;
  if (typeof input.timeSpent === "number") {
    session.stats.averageTime = ((session.stats.averageTime ?? 0) * (session.stats.totalAnswered - 1) + input.timeSpent) / session.stats.totalAnswered;
  }

  if (type === "review") {
    const wrongAnswer = await WrongAnswer.findOne({ studentId, questionId: input.questionId });
    if (wrongAnswer) {
      const schedule = calculateNextReview(wrongAnswer.reviewCount ?? 0, isCorrect);
      wrongAnswer.reviewCount = schedule.reviewCount;
      wrongAnswer.reviewStatus = schedule.mastered ? "mastered" : isCorrect ? "reviewing" : "pending";
      wrongAnswer.lastReviewedAt = new Date();
      wrongAnswer.nextReviewAt = schedule.mastered ? undefined : schedule.nextReviewAt;
      await wrongAnswer.save();
    }
  }

  if (session.stats.totalAnswered >= session.config.totalQuestions) {
    session.status = "completed";
    session.completedAt = new Date();
  }
  await session.save();

  const mastery = await updateMastery(studentId, question, isCorrect, input.timeSpent);
  await invalidateProgressOverview(studentId);
  if (!isCorrect) {
    await saveWrongAnswer(studentId, question, answerText);
  }

  return {
    isCorrect,
    feedback: selectWarmFeedback(isCorrect ? "correct" : "notQuite"),
    explanation: question.explanation,
    mastery
  };
}

export async function completeWrongAnswerReview(studentId: string, wrongAnswerId: string) {
  const wrongAnswer = await WrongAnswer.findOne({ _id: wrongAnswerId, studentId });
  if (!wrongAnswer) {
    throw new AppError(404, "NOT_FOUND", "We could not find that wrong answer yet.");
  }

  const question = await getQuestionById(String(wrongAnswer.questionId));
  if (!question) {
    throw new AppError(404, "NOT_FOUND", "We could not find the related question yet.");
  }

  const schedule = calculateNextReview(wrongAnswer.reviewCount ?? 0, true);
  wrongAnswer.reviewCount = schedule.reviewCount;
  wrongAnswer.reviewStatus = schedule.mastered ? "mastered" : "reviewing";
  wrongAnswer.lastReviewedAt = new Date();
  wrongAnswer.nextReviewAt = schedule.mastered ? undefined : schedule.nextReviewAt;
  await wrongAnswer.save();
  await invalidateProgressOverview(studentId);

  return wrongAnswerRecord(wrongAnswer.toObject(), question);
}

export async function markWrongAnswerMastered(studentId: string, wrongAnswerId: string) {
  const wrongAnswer = await WrongAnswer.findOne({ _id: wrongAnswerId, studentId });
  if (!wrongAnswer) {
    throw new AppError(404, "NOT_FOUND", "We could not find that wrong answer yet.");
  }

  const question = await getQuestionById(String(wrongAnswer.questionId));
  if (!question) {
    throw new AppError(404, "NOT_FOUND", "We could not find the related question yet.");
  }

  wrongAnswer.reviewStatus = "mastered";
  wrongAnswer.reviewCount = Math.max(wrongAnswer.reviewCount ?? 0, 4);
  wrongAnswer.lastReviewedAt = new Date();
  wrongAnswer.nextReviewAt = undefined;
  await wrongAnswer.save();
  await invalidateProgressOverview(studentId);

  return wrongAnswerRecord(wrongAnswer.toObject(), question);
}
