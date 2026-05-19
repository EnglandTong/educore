import { randomUUID } from "node:crypto";

import { SignJWT, jwtVerify } from "jose";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import { env } from "../../src/config/env.js";
import { AppError } from "../../src/utils/errors.js";

type UserRole = "student" | "parent" | "teacher";

type Profile = {
  id: string;
  name: string;
  email: string;
  role: "student" | "parent" | "teacher" | "admin" | "volunteer";
  avatar?: string;
  nickname?: string;
  age?: number;
  gradeLevel?: string;
  createdAt: string;
  preferences?: {
    language: "en" | "zh";
    theme: "light" | "dark" | "auto";
    dailyGoal?: number;
  };
};

type UserRecord = Profile & {
  password: string;
  inviteCode?: string;
};

type SessionRecord = {
  id: string;
  studentId: string;
  moduleId: string;
  type: "diagnostic" | "training" | "review" | "challenge";
  status: "active" | "completed";
  currentQuestionIndex: number;
  totalQuestions: number;
  correctCount: number;
  startedAt: string;
  completedAt?: string;
  questions: Array<{ questionId: string; answered: boolean; isCorrect?: boolean; studentAnswer?: string }>;
};

type ConversationRecord = {
  id: string;
  teacherId: string;
  teacherName: string;
  parentId: string;
  parentName: string;
  studentId: string;
  studentName: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
  messages: Array<{
    id: string;
    conversationId: string;
    senderId: string;
    senderName: string;
    senderRole: "teacher" | "parent";
    content: string;
    sentAt: string;
  }>;
};

type SharedState = {
  sequence: number;
  usersById: Map<string, UserRecord>;
  userIdsByEmail: Map<string, string>;
  refreshJtiByUserId: Map<string, string>;
  parentLinks: Map<string, { parentId: string; studentId: string; relationship: string; consentGiven: boolean; consentDate?: string }>;
  progressByStudentId: Map<string, any>;
  wrongAnswersByStudentId: Map<string, any[]>;
  learningSessionsById: Map<string, SessionRecord>;
  conversationsById: Map<string, ConversationRecord>;
  teacherAssignmentsByTeacherId: Map<string, Set<string>>;
};

const state = vi.hoisted<SharedState>(() => ({
  sequence: 0,
  usersById: new Map(),
  userIdsByEmail: new Map(),
  refreshJtiByUserId: new Map(),
  parentLinks: new Map(),
  progressByStudentId: new Map(),
  wrongAnswersByStudentId: new Map(),
  learningSessionsById: new Map(),
  conversationsById: new Map(),
  teacherAssignmentsByTeacherId: new Map()
}));

const secret = new TextEncoder().encode(env.JWT_SECRET);

function resetState(): void {
  state.sequence = 0;
  state.usersById.clear();
  state.userIdsByEmail.clear();
  state.refreshJtiByUserId.clear();
  state.parentLinks.clear();
  state.progressByStudentId.clear();
  state.wrongAnswersByStudentId.clear();
  state.learningSessionsById.clear();
  state.conversationsById.clear();
  state.teacherAssignmentsByTeacherId.clear();
}

function nextId(prefix: string): string {
  state.sequence += 1;
  return `${prefix}-${state.sequence}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

function toProfile(user: UserRecord): Profile {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    nickname: user.nickname,
    age: user.age,
    gradeLevel: user.gradeLevel,
    createdAt: user.createdAt,
    preferences: user.preferences
  };
}

async function issueTokenPair(user: UserRecord): Promise<{ accessToken: string; refreshToken: string }> {
  const sessionId = randomUUID();
  const baseClaims = {
    email: user.email,
    role: user.role
  };

  const accessToken = await new SignJWT({ ...baseClaims, tokenType: "access" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setJti(sessionId)
    .setIssuedAt()
    .setExpirationTime(env.JWT_ACCESS_EXPIRY)
    .sign(secret);

  const refreshToken = await new SignJWT({ ...baseClaims, tokenType: "refresh" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setJti(sessionId)
    .setIssuedAt()
    .setExpirationTime(env.JWT_REFRESH_EXPIRY)
    .sign(secret);

  state.refreshJtiByUserId.set(user.id, sessionId);
  return { accessToken, refreshToken };
}

function getUserByEmail(email: string): UserRecord | undefined {
  const userId = state.userIdsByEmail.get(email);
  return userId ? state.usersById.get(userId) : undefined;
}

function seedProgress(studentId: string) {
  if (!state.progressByStudentId.has(studentId)) {
    state.progressByStudentId.set(studentId, {
      studentId,
      modules: [
        {
          moduleId: "english-grammar",
          moduleName: "English Grammar",
          overallScore: 78,
          overallLevel: "proficient",
          skillCount: 3,
          masteredCount: 2,
          lastActivityAt: nowIso()
        }
      ],
      totalXP: 780,
      currentStreak: 4,
      longestStreak: 8
    });
  }
  return state.progressByStudentId.get(studentId);
}

function ensureWrongAnswerBucket(studentId: string): any[] {
  if (!state.wrongAnswersByStudentId.has(studentId)) {
    state.wrongAnswersByStudentId.set(studentId, []);
  }
  return state.wrongAnswersByStudentId.get(studentId)!;
}

function upsertTeacherAssignment(teacherId: string, studentId: string): void {
  const current = state.teacherAssignmentsByTeacherId.get(teacherId) ?? new Set<string>();
  current.add(studentId);
  state.teacherAssignmentsByTeacherId.set(teacherId, current);
}

function createSession(studentId: string, type: SessionRecord["type"], moduleId: string, totalQuestions: number): SessionRecord {
  const session: SessionRecord = {
    id: nextId("session"),
    studentId,
    moduleId,
    type,
    status: "active",
    currentQuestionIndex: 0,
    totalQuestions,
    correctCount: 0,
    startedAt: nowIso(),
    questions: []
  };
  state.learningSessionsById.set(session.id, session);
  return session;
}

function findActiveSession(studentId: string, type: SessionRecord["type"]): SessionRecord | undefined {
  return Array.from(state.learningSessionsById.values()).find((session) => session.studentId === studentId && session.type === type && session.status === "active");
}

async function signRefreshRotation(user: UserRecord, refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
  const { payload } = await jwtVerify(refreshToken, secret);
  if (payload.tokenType !== "refresh") {
    throw new AppError(401, "UNAUTHORIZED", "This session needs a quick refresh. Please sign in again.");
  }

  const currentJti = state.refreshJtiByUserId.get(user.id);
  if (!currentJti || currentJti !== payload.jti) {
    throw new AppError(401, "UNAUTHORIZED", "This session needs a quick refresh. Please sign in again.");
  }

  return issueTokenPair(user);
}

vi.mock("../../src/services/auth.service.ts", () => ({
  registerUser: vi.fn(async (input: { name: string; email: string; password: string; role: UserRole }) => {
    if (getUserByEmail(input.email)) {
      throw new AppError(409, "CONFLICT", "That email is already in use. Let's try a different one.");
    }

    const user: UserRecord = {
      id: nextId("user"),
      name: input.name,
      email: input.email,
      password: input.password,
      role: input.role,
      createdAt: nowIso(),
      preferences: { language: "en", theme: "auto" },
      inviteCode: input.role === "student" ? nextId("invite").toUpperCase() : undefined
    };

    state.usersById.set(user.id, user);
    state.userIdsByEmail.set(user.email, user.id);
    if (user.role === "student") {
      seedProgress(user.id);
    }

    const tokens = await issueTokenPair(user);
    return { user: toProfile(user), ...tokens };
  }),
  loginUser: vi.fn(async (input: { email: string; password: string }) => {
    const user = getUserByEmail(input.email);
    if (!user || user.password !== input.password) {
      throw new AppError(401, "UNAUTHORIZED", "Hmm, that email or password does not seem to match. Please try again.");
    }

    const tokens = await issueTokenPair(user);
    return { user: toProfile(user), ...tokens };
  }),
  refreshTokenPair: vi.fn(async (refreshToken: string) => {
    const { payload } = await jwtVerify(refreshToken, secret);
    const userId = String(payload.sub);
    const user = state.usersById.get(userId);
    if (!user) {
      throw new AppError(401, "UNAUTHORIZED", "Let's get you signed in so we can keep your progress safe.");
    }
    return signRefreshRotation(user, refreshToken);
  }),
  getCurrentUserProfile: vi.fn(async (userId: string) => {
    const user = state.usersById.get(userId);
    if (!user) {
      throw new AppError(404, "NOT_FOUND", "We could not find your profile yet. Please sign in again.");
    }
    return toProfile(user);
  }),
  updateCurrentUserProfile: vi.fn(async (userId: string, patch: Record<string, unknown>) => {
    const user = state.usersById.get(userId);
    if (!user) {
      throw new AppError(404, "NOT_FOUND", "We could not find your profile yet. Please sign in again.");
    }
    const next = { ...user, ...patch } as UserRecord;
    state.usersById.set(userId, next);
    return toProfile(next);
  })
}));

vi.mock("../../src/services/progress.service.ts", () => ({
  getProgressOverview: vi.fn(async (studentId: string) => seedProgress(studentId)),
  getSkillMasteryList: vi.fn(async (studentId: string) => [
    {
      studentId,
      moduleId: "english-grammar",
      skillId: "present-simple",
      skillName: "Present Simple",
      score: 84,
      level: "proficient",
      streak: { current: 2, best: 5 },
      totalAttempts: 10,
      correctAttempts: 8,
      lastPracticedAt: nowIso(),
      nextReviewAt: nowIso()
    }
  ]),
  getProgressTimeline: vi.fn(async (_studentId: string) => [
    {
      skillId: "present-simple",
      score: 84,
      level: "proficient",
      lastPracticedAt: nowIso(),
      nextReviewAt: nowIso()
    }
  ])
}));

vi.mock("../../src/services/question.service.ts", () => ({
  listQuestions: vi.fn(async (query: { moduleId?: string; skillId?: string; limit?: number }) => {
    const limit = query.limit ?? 20;
    return Array.from({ length: Math.min(3, limit) }, (_, index) => ({
      id: `question-${index + 1}`,
      moduleId: query.moduleId ?? "english-grammar",
      skill: query.skillId ?? "present-simple",
      questionType: "multiple-choice",
      difficulty: 0.55,
      prompt: `Question ${index + 1}`,
      answerKey: "A",
      explanation: "A warm explanation",
      options: ["A", "B", "C", "D"]
    }));
  })
}));

vi.mock("../../src/services/learning.service.ts", () => ({
  startLearningSession: vi.fn(async (studentId: string, type: "diagnostic" | "training", moduleId?: string) => {
    const session = createSession(studentId, type, moduleId ?? "english-grammar", type === "diagnostic" ? 25 : 30);
    return { session };
  }),
  getNextLearningQuestion: vi.fn(async (studentId: string, type: "diagnostic" | "training") => {
    const session = findActiveSession(studentId, type);
    if (!session) {
      throw new AppError(404, "NOT_FOUND", "We could not find an active session yet. Start one and we can continue together.");
    }
    const question = {
      id: `${type}-question-1`,
      moduleId: session.moduleId,
      skill: "present-simple",
      questionType: "multiple-choice",
      difficulty: 0.55,
      prompt: `${type} prompt`,
      answerKey: "A",
      explanation: "A warm explanation",
      options: ["A", "B", "C", "D"]
    };
    return { session, question };
  }),
  submitLearningAnswer: vi.fn(async (studentId: string, input: { sessionId: string; questionId: string; answer: string | string[] }) => {
    const session = state.learningSessionsById.get(input.sessionId);
    if (!session || session.studentId !== studentId) {
      throw new AppError(404, "NOT_FOUND", "We could not find that session. Please start a new one and we can keep going.");
    }

    const answer = Array.isArray(input.answer) ? input.answer.join(",") : input.answer;
    const isCorrect = answer.toUpperCase() === "A";
    session.correctCount += isCorrect ? 1 : 0;
    session.currentQuestionIndex += 1;
    session.questions.push({ questionId: input.questionId, answered: true, isCorrect, studentAnswer: answer });
    if (isCorrect) {
      seedProgress(studentId).modules[0].overallScore = 82;
      seedProgress(studentId).totalXP = 820;
    } else {
      ensureWrongAnswerBucket(studentId).push({
        id: nextId("wrong"),
        questionId: input.questionId,
        question: { id: input.questionId, moduleId: session.moduleId, skill: "present-simple", questionType: "multiple-choice", difficulty: 0.55, prompt: "Question", answerKey: "A", explanation: "A warm explanation" },
        studentAnswer: answer,
        correctAnswer: "A",
        explanation: "A warm explanation",
        createdAt: nowIso(),
        reviewStatus: "pending",
        reviewCount: 0
      });
    }
    session.status = session.currentQuestionIndex >= 1 ? "completed" : "active";
    return {
      isCorrect,
      feedback: isCorrect ? "You are on the right track." : "That was close. Let's try again with a smaller step.",
      explanation: "A warm explanation",
      mastery: {
        skillId: "present-simple",
        skillName: "Present Simple",
        score: isCorrect ? 82 : 64,
        level: isCorrect ? "proficient" : "developing",
        questionsAttempted: session.currentQuestionIndex,
        questionsCorrect: session.correctCount,
        nextReviewAt: nowIso()
      }
    };
  }),
  getDiagnosticReport: vi.fn(async (studentId: string) => ({
    sessionId: `diagnostic-${studentId}`,
    estimatedLevel: "developing",
    skillScores: [],
    strengths: ["Keeps going"],
    weaknesses: ["Needs a little more practice"],
    nextSteps: ["Try one short training set"],
    encouragement: "You collected solid evidence about your skills. We can use that to guide the next round."
  })),
  endLearningSession: vi.fn(async (studentId: string, type: "training" | "challenge") => ({
    sessionId: `${type}-${studentId}`,
    accuracy: 0.75,
    totalQuestions: 4,
    correctCount: 3,
    timeSpent: 120,
    skillBreakdown: [],
    strengths: [],
    growthAreas: [],
    levelEstimate: undefined,
    encouragement: "You kept going, and that effort matters. Let's build on it next time."
  })),
  startReviewSession: vi.fn(async (studentId: string) => {
    const wrongAnswers = ensureWrongAnswerBucket(studentId);
    const session = createSession(studentId, "review", "english-grammar", Math.max(1, wrongAnswers.length));
    session.questions = wrongAnswers.slice(0, 1).map((wrongAnswer) => ({ questionId: wrongAnswer.questionId, answered: false }));
    return { session, wrongAnswers };
  }),
  getNextWrongAnswerSessionQuestion: vi.fn(async (studentId: string) => {
    const session = findActiveSession(studentId, "review");
    if (!session) {
      throw new AppError(404, "NOT_FOUND", "We could not find an active session yet. Start one and we can continue together.");
    }
    const next = session.questions.find((question) => !question.answered);
    return {
      session,
      question: {
        id: next?.questionId ?? "review-question-1",
        moduleId: session.moduleId,
        skill: "present-simple",
        questionType: "multiple-choice",
        difficulty: 0.55,
        prompt: "Review question",
        answerKey: "A",
        explanation: "A warm explanation",
        options: ["A", "B", "C", "D"]
      }
    };
  }),
  answerWrongAnswerSessionQuestion: vi.fn(async (_studentId: string, input: { sessionId: string; questionId: string; answer: string | string[] }) => {
    const session = state.learningSessionsById.get(input.sessionId);
    if (!session || session.studentId !== _studentId) {
      throw new AppError(404, "NOT_FOUND", "We could not find that session. Please start a new one and we can keep going.");
    }

    const answer = Array.isArray(input.answer) ? input.answer.join(",") : input.answer;
    const isCorrect = answer.toUpperCase() === "A";
    const queued = ensureWrongAnswerBucket(_studentId).find((item) => item.questionId === input.questionId);
    if (queued && isCorrect) {
      queued.reviewStatus = "mastered";
    }
    session.questions = session.questions.map((entry) => entry.questionId === input.questionId ? { ...entry, answered: true, isCorrect } : entry);
    return {
      isCorrect,
      feedback: "You are on the right track.",
      explanation: "A warm explanation",
      mastery: {
        skillId: "present-simple",
        skillName: "Present Simple",
        score: 85,
        level: "proficient",
        questionsAttempted: 2,
        questionsCorrect: 2,
        nextReviewAt: nowIso()
      }
    };
  }),
  startChallengeSession: vi.fn(async (studentId: string) => {
    const progress = seedProgress(studentId);
    if ((progress.modules[0]?.overallScore ?? 0) < 70) {
      throw new AppError(409, "CONFLICT", "You’re very close. Build a little more mastery before the challenge opens.");
    }

    const session = createSession(studentId, "challenge", "english-grammar", 6);
    const questions = Array.from({ length: 6 }, (_, index) => ({
      id: `challenge-question-${index + 1}`,
      moduleId: "english-grammar",
      skill: "present-simple",
      questionType: "multiple-choice",
      difficulty: 0.65,
      prompt: `Challenge question ${index + 1}`,
      answerKey: "A",
      explanation: "A warm explanation",
      options: ["A", "B", "C", "D"]
    }));
    session.questions = questions.map((question) => ({ questionId: question.id, answered: false }));
    return { session, questions };
  })
}));

vi.mock("../../src/services/parent.service.ts", () => ({
  listLinkedChildren: vi.fn(async (parentId: string) => {
    return Array.from(state.parentLinks.values())
      .filter((link) => link.parentId === parentId && link.consentGiven)
      .map((link) => {
        const child = state.usersById.get(link.studentId);
        return child
          ? {
              id: child.id,
              name: child.name,
              avatar: child.avatar,
              nickname: child.nickname,
              gradeLevel: child.gradeLevel,
              relationship: link.relationship,
              consentGiven: link.consentGiven,
              consentDate: link.consentDate
            }
          : null;
      })
      .filter(Boolean);
  }),
  linkChildByInviteCode: vi.fn(async (parentId: string, inviteCode: string, relationship: string) => {
    const student = Array.from(state.usersById.values()).find((user) => user.inviteCode === inviteCode);
    if (!student) {
      throw new AppError(404, "NOT_FOUND", "We could not find that invitation code yet. Let's check the code and try again.");
    }

    const link = {
      parentId,
      studentId: student.id,
      relationship,
      consentGiven: false as const
    };
    state.parentLinks.set(`${parentId}:${student.id}`, link);
    return link;
  }),
  updateGuardianConsent: vi.fn(async (parentId: string, studentId: string, consentGiven: boolean) => {
    const key = `${parentId}:${studentId}`;
    const link = state.parentLinks.get(key);
    if (!link) {
      throw new AppError(404, "NOT_FOUND", "We could not find that connection yet. Let's try again.");
    }
    const updated = { ...link, consentGiven, consentDate: consentGiven ? nowIso() : undefined };
    state.parentLinks.set(key, updated);
    return updated;
  }),
  getChildProgress: vi.fn(async (parentId: string, studentId: string) => {
    const link = state.parentLinks.get(`${parentId}:${studentId}`);
    if (!link || !link.consentGiven) {
      throw new AppError(403, "FORBIDDEN", "This child is not linked to your account yet. Let's finish the connection first.");
    }
    return seedProgress(studentId);
  }),
  getChildActivity: vi.fn(async (parentId: string, studentId: string) => {
    const link = state.parentLinks.get(`${parentId}:${studentId}`);
    if (!link || !link.consentGiven) {
      throw new AppError(403, "FORBIDDEN", "This child is not linked to your account yet. Let's finish the connection first.");
    }
    return {
      childId: studentId,
      recentSessions: [],
      recentMessages: []
    };
  }),
  getSubjectGuide: vi.fn(async (parentId: string, moduleId: string, skillId: string) => {
    if (!Array.from(state.parentLinks.values()).some((link) => link.parentId === parentId && link.consentGiven)) {
      throw new AppError(403, "FORBIDDEN", "This guide is available after a child is linked with consent.");
    }
    return {
      moduleId,
      skillId,
      skillName: "Present Simple",
      title: "Present Simple",
      whatIsIt: "A warm guide",
      howToHelp: ["Offer one short example at a time."],
      commonMistakes: ["Rushing through the question before reading the whole prompt."],
      signsOfProgress: ["Your child is answering with more consistency."],
      ifStruggling: ["Pause and revisit one example with a calmer pace."]
    };
  })
}));

vi.mock("../../src/services/teacher.service.ts", () => ({
  getClassOverview: vi.fn(async (teacherId: string) => {
    const roster = Array.from(state.teacherAssignmentsByTeacherId.get(teacherId) ?? []);
    return {
      teacherId,
      studentCount: roster.length,
      averageScore: 81,
      gradeGroups: { "grade-3": roster.length },
      topWeakAreas: [
        {
          skillId: "present-simple",
          skillName: "Present Simple",
          averageScore: 61,
          level: "developing"
        }
      ]
    };
  }),
  getStudentSummary: vi.fn(async (teacherId: string, studentId: string) => {
    const roster = state.teacherAssignmentsByTeacherId.get(teacherId) ?? new Set<string>();
    if (!roster.has(studentId)) {
      throw new AppError(404, "NOT_FOUND", "We could not find that student in your assigned group.");
    }
    const student = state.usersById.get(studentId);
    if (!student) {
      return null;
    }
    return {
      teacherId,
      student: {
        id: student.id,
        name: student.name,
        gradeLevel: student.gradeLevel,
        avatar: student.avatar,
        nickname: student.nickname
      },
      progress: seedProgress(studentId),
      masteryCount: 2,
      activeSkills: 1
    };
  }),
  getClassWeakAreas: vi.fn(async (teacherId: string) => ({
    weakAreas: Array.from(state.teacherAssignmentsByTeacherId.get(teacherId) ?? []).length > 0
      ? [{
          moduleId: "english-grammar",
          skillId: "present-simple",
          skillName: "Present Simple",
          averageScore: 61,
          level: "developing"
        }]
      : []
  }))
}));

vi.mock("../../src/services/community.service.ts", () => ({
  listAnnouncementsForUser: vi.fn(async () => [
    {
      id: "announcement-1",
      schoolId: "default-school",
      authorId: "teacher-1",
      authorName: "Teacher Nora",
      title: "Welcome to the week",
      content: "A warm announcement.",
      type: "news",
      targetAudience: "all",
      classIds: [],
      publishedAt: nowIso(),
      isRead: false
    }
  ]),
  createAnnouncement: vi.fn(async (author: { id: string; name: string; role: string }, input: any) => ({
    id: nextId("announcement"),
    schoolId: input.schoolId ?? "default-school",
    authorId: author.id,
    authorName: author.name,
    title: input.title,
    content: input.content,
    type: input.type,
    targetAudience: input.targetAudience,
    classIds: input.classIds ?? [],
    publishedAt: nowIso(),
    isRead: false
  })),
  markAnnouncementRead: vi.fn(async (_userId: string, announcementId: string) => ({
    id: announcementId,
    schoolId: "default-school",
    authorId: "teacher-1",
    authorName: "Teacher Nora",
    title: "Welcome to the week",
    content: "A warm announcement.",
    type: "news",
    targetAudience: "all",
    classIds: [],
    publishedAt: nowIso(),
    isRead: true
  })),
  listConversationsForUser: vi.fn(async (userId: string, role: string) => {
    return Array.from(state.conversationsById.values())
      .filter((conversation) => (role === "teacher" ? conversation.teacherId === userId : conversation.parentId === userId))
      .map((conversation) => ({
        id: conversation.id,
        teacherId: conversation.teacherId,
        teacherName: conversation.teacherName,
        parentId: conversation.parentId,
        parentName: conversation.parentName,
        studentId: conversation.studentId,
        studentName: conversation.studentName,
        lastMessage: conversation.lastMessage,
        lastMessageAt: conversation.lastMessageAt,
        unreadCount: conversation.unreadCount
      }));
  }),
  createConversation: vi.fn(async (user: { id: string; name: string; role: string }, input: { studentId: string; teacherId?: string; parentId?: string; initialMessage?: string }) => {
    const student = state.usersById.get(input.studentId);
    if (!student) {
      throw new AppError(404, "NOT_FOUND", "We could not find that student yet.");
    }

    const parentId = input.parentId ?? Array.from(state.parentLinks.values()).find((link) => link.studentId === input.studentId && link.consentGiven)?.parentId;
    if (!parentId) {
      throw new AppError(403, "FORBIDDEN", "This family connection is not ready yet.");
    }
    const parent = state.usersById.get(parentId);
    if (!parent) {
      throw new AppError(404, "NOT_FOUND", "We could not find that parent account yet.");
    }

    const conversation: ConversationRecord = {
      id: nextId("conversation"),
      teacherId: user.role === "teacher" ? user.id : input.teacherId ?? "teacher-1",
      teacherName: user.role === "teacher" ? user.name : "Teacher Nora",
      parentId,
      parentName: parent.name,
      studentId: student.id,
      studentName: student.name,
      lastMessage: input.initialMessage,
      lastMessageAt: input.initialMessage ? nowIso() : undefined,
      unreadCount: input.initialMessage ? 1 : 0,
      messages: []
    };

    if (input.initialMessage) {
      conversation.messages.push({
        id: nextId("message"),
        conversationId: conversation.id,
        senderId: user.id,
        senderName: user.name,
        senderRole: user.role === "teacher" ? "teacher" : "parent",
        content: input.initialMessage,
        sentAt: nowIso()
      });
    }

    state.conversationsById.set(conversation.id, conversation);
    upsertTeacherAssignment(conversation.teacherId, conversation.studentId);
    return {
      id: conversation.id,
      teacherId: conversation.teacherId,
      teacherName: conversation.teacherName,
      parentId: conversation.parentId,
      parentName: conversation.parentName,
      studentId: conversation.studentId,
      studentName: conversation.studentName,
      lastMessage: conversation.lastMessage,
      lastMessageAt: conversation.lastMessageAt,
      unreadCount: conversation.unreadCount
    };
  }),
  listMessagesForUser: vi.fn(async (userId: string, role: string, conversationId: string) => {
    const conversation = state.conversationsById.get(conversationId);
    if (!conversation || (role === "teacher" ? conversation.teacherId !== userId : conversation.parentId !== userId)) {
      throw new AppError(404, "NOT_FOUND", "We could not find that conversation yet.");
    }

    return conversation.messages;
  }),
  sendMessageInConversation: vi.fn(async (user: { id: string; name: string; role: string }, conversationId: string, input: { content: string }) => {
    const conversation = state.conversationsById.get(conversationId);
    if (!conversation || (user.role === "teacher" ? conversation.teacherId !== user.id : conversation.parentId !== user.id)) {
      throw new AppError(404, "NOT_FOUND", "We could not find that conversation yet.");
    }

    const message = {
      id: nextId("message"),
      conversationId,
      senderId: user.id,
      senderName: user.name,
      senderRole: (user.role === "teacher" ? "teacher" : "parent") as "teacher" | "parent",
      content: input.content,
      sentAt: nowIso()
    };
    conversation.messages.push(message);
    conversation.lastMessage = input.content;
    conversation.lastMessageAt = message.sentAt;
    conversation.unreadCount = 1;
    return message;
  })
}));

vi.mock("../../src/services/notifications.service.ts", () => ({
  listNotifications: vi.fn(async (userId: string) => [
    {
      id: `notification-${userId}`,
      userId,
      title: "A warm reminder",
      body: "You have one gentle update waiting.",
      type: "reminder",
      readAt: undefined,
      data: {}
    }
  ]),
  markNotificationRead: vi.fn(async (userId: string, notificationId: string) => ({
    id: notificationId,
    userId,
    title: "A warm reminder",
    body: "You have one gentle update waiting.",
    type: "reminder",
    readAt: nowIso(),
    data: {}
  }))
}));

const { buildApp } = await import("../../src/app.js");
const app = buildApp();

async function registerAccount(role: UserRole, overrides: Partial<{ name: string; email: string; password: string }> = {}) {
  const response = await app.inject({
    method: "POST",
    url: "/api/v1/auth/register",
    payload: {
      name: overrides.name ?? `${role} learner`,
      email: overrides.email ?? `${role}-${nextId("mail")}@example.com`,
      password: overrides.password ?? "Password123!",
      role
    }
  });

  expect(response.statusCode).toBe(201);
  const body = response.json() as any;
  expect(body.success).toBe(true);
  return body.data as { user: Profile; accessToken: string; refreshToken: string };
}

async function postJson(url: string, token: string, payload?: unknown): Promise<any> {
  return app.inject({
    method: "POST",
    url,
    headers: { authorization: `Bearer ${token}` },
    payload: payload as any
  });
}

async function getJson(url: string, token: string): Promise<any> {
  return app.inject({
    method: "GET",
    url,
    headers: { authorization: `Bearer ${token}` }
  });
}

describe("Sprint 4 integration journeys", () => {
  beforeAll(async () => {
    await app.ready();
  });

  beforeEach(() => {
    resetState();
  });

  afterAll(async () => {
    await app.close();
  });

  it("supports the auth flow with refresh rotation", async () => {
    const register = await registerAccount("student", {
      name: "Mina",
      email: "mina@example.com",
      password: "Password123!"
    });

    const login = await app.inject({
      method: "POST",
      url: "/api/v1/auth/login",
      payload: { email: "mina@example.com", password: "Password123!" }
    });

    expect(login.statusCode).toBe(200);
    const loginBody = login.json() as any;
    expect(loginBody.success).toBe(true);

    const refresh = await app.inject({
      method: "POST",
      url: "/api/v1/auth/refresh",
      payload: { refreshToken: loginBody.data.refreshToken }
    });

    expect(refresh.statusCode).toBe(200);
    const refreshBody = refresh.json() as any;
    expect(refreshBody.data.refreshToken).not.toBe(loginBody.data.refreshToken);

    const replay = await app.inject({
      method: "POST",
      url: "/api/v1/auth/refresh",
      payload: { refreshToken: register.refreshToken }
    });

    expect(replay.statusCode).toBe(401);
  });

  it("covers the student journey from diagnostic through challenge and question serving", async () => {
    const student = await registerAccount("student", {
      name: "Mina",
      email: "mina-student@example.com"
    });

    const authHeader = student.accessToken;

    const diagnosticStart = await postJson("/api/v1/learning/diagnostic/start", authHeader, { moduleId: "english-grammar" });
    expect(diagnosticStart.statusCode).toBe(201);
    const diagnosticStartBody = diagnosticStart.json() as any;
    expect(diagnosticStartBody.data.session.type).toBe("diagnostic");

    const diagnosticNext = await getJson("/api/v1/learning/diagnostic/next", authHeader);
    const diagnosticNextBody = diagnosticNext.json() as any;
    expect(diagnosticNextBody.data.question.id).toContain("diagnostic");

    const diagnosticAnswer = await postJson("/api/v1/learning/diagnostic/answer", authHeader, {
      sessionId: diagnosticStartBody.data.session.id,
      questionId: diagnosticNextBody.data.question.id,
      answer: "A"
    });
    expect(diagnosticAnswer.statusCode).toBe(200);
    expect((diagnosticAnswer.json() as any).data.isCorrect).toBe(true);

    const diagnosticReport = await getJson("/api/v1/learning/diagnostic/report", authHeader);
    expect(diagnosticReport.statusCode).toBe(200);
    expect((diagnosticReport.json() as any).data.estimatedLevel).toBe("developing");

    const trainingStart = await postJson("/api/v1/learning/training/start", authHeader, { moduleId: "english-grammar" });
    expect(trainingStart.statusCode).toBe(201);
    const trainingStartBody = trainingStart.json() as any;

    const questions = await getJson("/api/v1/questions?moduleId=english-grammar&limit=1", authHeader);
    expect(questions.statusCode).toBe(200);
    expect((questions.json() as any).data.questions).toHaveLength(1);

    const trainingNext = await getJson("/api/v1/learning/training/next", authHeader);
    const trainingNextBody = trainingNext.json() as any;

    const trainingAnswer = await postJson("/api/v1/learning/training/answer", authHeader, {
      sessionId: trainingStartBody.data.session.id,
      questionId: trainingNextBody.data.question.id,
      answer: "B"
    });
    expect(trainingAnswer.statusCode).toBe(200);
    expect((trainingAnswer.json() as any).data.isCorrect).toBe(false);

    const reviewStart = await postJson("/api/v1/learning/review/start", authHeader);
    expect(reviewStart.statusCode).toBe(201);

    const reviewNext = await getJson("/api/v1/learning/review/next", authHeader);
    expect(reviewNext.statusCode).toBe(200);

    const reviewAnswer = await postJson("/api/v1/learning/review/answer", authHeader, {
      sessionId: (reviewStart.json() as any).data.session.id,
      questionId: (reviewNext.json() as any).data.question.id,
      answer: "A"
    });
    expect(reviewAnswer.statusCode).toBe(200);

    const challengeStart = await postJson("/api/v1/learning/challenge/start", authHeader);
    expect(challengeStart.statusCode).toBe(201);
    expect((challengeStart.json() as any).data.questions).toHaveLength(6);

    const challengeAnswer = await postJson("/api/v1/learning/challenge/answer", authHeader, {
      sessionId: (challengeStart.json() as any).data.session.id,
      questionId: (challengeStart.json() as any).data.questions[0].id,
      answer: "A"
    });
    expect(challengeAnswer.statusCode).toBe(200);

    const challengeResult = await getJson("/api/v1/learning/challenge/result", authHeader);
    expect(challengeResult.statusCode).toBe(200);
  });

  it("supports the parent journey without self-service consent", async () => {
    const student = await registerAccount("student", {
      name: "Ivy Student",
      email: "ivy.student@example.com"
    });
    const studentRecord = state.usersById.get(student.user.id);
    expect(studentRecord?.inviteCode).toBeDefined();

    const parent = await registerAccount("parent", {
      name: "Parent Ivy",
      email: "ivy.parent@example.com"
    });

    const linkResponse = await postJson("/api/v1/parent/links", parent.accessToken, {
      inviteCode: studentRecord!.inviteCode,
      relationship: "mother",
      consentGiven: true
    });
    expect(linkResponse.statusCode).toBe(201);
    expect((linkResponse.json() as any).data.link.consentGiven).toBe(false);

    const consentResponse = await app.inject({
      method: "PUT",
      url: `/api/v1/parent/children/${student.user.id}/consent`,
      headers: { authorization: `Bearer ${parent.accessToken}` },
      payload: { consentGiven: true }
    });
    expect(consentResponse.statusCode).toBe(200);

    const children = await getJson("/api/v1/parent/children", parent.accessToken);
    expect(children.statusCode).toBe(200);
    expect((children.json() as any).data.children).toHaveLength(1);

    const progress = await getJson(`/api/v1/parent/children/${student.user.id}/progress`, parent.accessToken);
    expect(progress.statusCode).toBe(200);
    expect((progress.json() as any).data.progress.studentId).toBe(student.user.id);

    const activity = await getJson(`/api/v1/parent/children/${student.user.id}/activity`, parent.accessToken);
    expect(activity.statusCode).toBe(200);

    const guide = await getJson("/api/v1/parent/guides/english-grammar/present-simple", parent.accessToken);
    expect(guide.statusCode).toBe(200);
  });

  it("supports the teacher journey from login to class view and messaging", async () => {
    await registerAccount("teacher", {
      name: "Teacher Nora",
      email: "nora.teacher@example.com"
    });
    const parent = await registerAccount("parent", {
      name: "Ivy Parent",
      email: "ivy.parent.teacher@example.com"
    });
    const student = await registerAccount("student", {
      name: "Ivy Student",
      email: "ivy.student.teacher@example.com"
    });
    const studentRecord = state.usersById.get(student.user.id)!;

    await postJson("/api/v1/parent/links", parent.accessToken, {
      inviteCode: studentRecord.inviteCode!,
      relationship: "mother"
    });
    await app.inject({
      method: "PUT",
      url: `/api/v1/parent/children/${student.user.id}/consent`,
      headers: { authorization: `Bearer ${parent.accessToken}` },
      payload: { consentGiven: true }
    });

    const login = await app.inject({
      method: "POST",
      url: "/api/v1/auth/login",
      payload: { email: "nora.teacher@example.com", password: "Password123!" }
    });
    expect(login.statusCode).toBe(200);
    const teacherAccessToken = (login.json() as any).data.accessToken as string;

    const conversation = await postJson("/api/v1/community/conversations", teacherAccessToken, {
      studentId: student.user.id,
      initialMessage: "A warm check-in from class."
    });
    expect(conversation.statusCode).toBe(201);
    const conversationId = (conversation.json() as any).data.conversation.id as string;

    const overview = await getJson("/api/v1/teacher/class/overview", teacherAccessToken);
    expect(overview.statusCode).toBe(200);
    expect((overview.json() as any).data.overview.studentCount).toBe(1);

    const sendMessage = await postJson(`/api/v1/community/conversations/${conversationId}/messages`, teacherAccessToken, {
      content: "Let's keep the next step small and steady."
    });
    expect(sendMessage.statusCode).toBe(201);

    const messages = await getJson(`/api/v1/community/conversations/${conversationId}/messages`, teacherAccessToken);
    expect(messages.statusCode).toBe(200);
    expect((messages.json() as any).data.messages).toHaveLength(2);
  });

  it("keeps each parent inside their own child data boundary", async () => {
    const parentA = await registerAccount("parent", {
      name: "Parent A",
      email: "parent-a@example.com"
    });
    const childA = await registerAccount("student", {
      name: "Child A",
      email: "child-a@example.com"
    });
    const parentB = await registerAccount("parent", {
      name: "Parent B",
      email: "parent-b@example.com"
    });
    const childB = await registerAccount("student", {
      name: "Child B",
      email: "child-b@example.com"
    });

    const childAInvite = state.usersById.get(childA.user.id)!.inviteCode!;
    const childBInvite = state.usersById.get(childB.user.id)!.inviteCode!;

    await postJson("/api/v1/parent/links", parentA.accessToken, { inviteCode: childAInvite, relationship: "mother" });
    await postJson("/api/v1/parent/links", parentB.accessToken, { inviteCode: childBInvite, relationship: "father" });
    await app.inject({
      method: "PUT",
      url: `/api/v1/parent/children/${childA.user.id}/consent`,
      headers: { authorization: `Bearer ${parentA.accessToken}` },
      payload: { consentGiven: true }
    });
    await app.inject({
      method: "PUT",
      url: `/api/v1/parent/children/${childB.user.id}/consent`,
      headers: { authorization: `Bearer ${parentB.accessToken}` },
      payload: { consentGiven: true }
    });

    const forbidden = await getJson(`/api/v1/parent/children/${childB.user.id}/progress`, parentA.accessToken);
    expect(forbidden.statusCode).toBe(403);
  });
});
