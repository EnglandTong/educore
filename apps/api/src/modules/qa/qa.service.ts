import mongoose from "mongoose";

import { QAQuestion } from "../../models/QAQuestion.js";
import { QAAnswer } from "../../models/QAAnswer.js";
import type { CreateQuestionInput, CreateAnswerInput, RateAnswerInput } from "./qa.schema.js";

export async function listQuestions(status?: string) {
  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;
  const questions = await QAQuestion.find(filter)
    .sort({ createdAt: -1 })
    .limit(50)
    .lean()
    .exec();
  return questions;
}

export async function createQuestion(studentId: string, input: CreateQuestionInput) {
  const question = await QAQuestion.create({
    studentId: new mongoose.Types.ObjectId(studentId),
    moduleId: input.moduleId,
    skillId: input.skillId,
    content: input.content,
    status: "open",
    answers: []
  });
  return question.toObject();
}

export async function getQuestionById(questionId: string) {
  const question = await QAQuestion.findById(questionId)
    .populate("answers")
    .lean()
    .exec();
  return question;
}

export async function createAnswer(questionId: string, volunteerId: string, input: CreateAnswerInput) {
  const question = await QAQuestion.findById(questionId).exec();
  if (!question) return null;

  const answer = await QAAnswer.create({
    questionId: new mongoose.Types.ObjectId(questionId),
    volunteerId: new mongoose.Types.ObjectId(volunteerId),
    content: input.content,
    isAccepted: false
  });

  question.answers.push(answer._id);
  if (question.status === "open") {
    question.status = "answered";
  }
  await question.save();

  return answer.toObject();
}

export async function rateAnswer(answerId: string, input: RateAnswerInput) {
  const answer = await QAAnswer.findByIdAndUpdate(
    answerId,
    { $set: { rating: input.rating } },
    { new: true }
  ).lean().exec();
  return answer;
}
