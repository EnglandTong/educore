import type { AIChatInput, AIExplainInput, AISuggestInput, AIEncourageInput } from "./ai.schema.js";
import { filterInput, reviewOutput, stripPII, isAgeAppropriate } from "./content-filter.js";
import {
  pickEncouragement,
  buildExplanationPrompt,
  buildSuggestionPrompt,
  buildChatPrompt,
} from "./prompt-templates.js";
import { modelManager } from "./providers/manager.js";
// ChatOptions 类型暂时未使用，保留供未来扩展

// --- AI 调用 + 内容审核 + 自动 fallback ---

async function callAIWithReview(prompt: string): Promise<{ result: string; source: string }> {
  // 使用模型管理器，自动按优先级尝试各个 Provider
  const { result, providerId } = await modelManager.generate({ prompt });
  
  // 内容审核
  const reviewed = reviewOutput(result.text);
  const cleaned = stripPII(reviewed.sanitized);
  
  if (isAgeAppropriate(cleaned)) {
    return { result: cleaned, source: providerId };
  }
  
  // 审核不通过，用规则引擎
  return { result: "抱歉，我不能回答这个问题。", source: "rule" };
}


// --- Public API ---

export async function aiChat(input: AIChatInput): Promise<{ answer: string; source: string }> {
  // 输入过滤
  const inputFilter = filterInput(input.question);
  const sanitizedQuestion = inputFilter.sanitized;

  const prompt = buildChatPrompt({ question: sanitizedQuestion });

  const { result, source } = await callAIWithReview(prompt);
  return { answer: result, source };
}

export async function aiExplain(input: AIExplainInput): Promise<{ explanation: string; source: string }> {
  const prompt = buildExplanationPrompt({
    correctAnswer: input.correctAnswer,
    studentAnswer: input.studentAnswer,
  });

  const { result, source } = await callAIWithReview(prompt);
  return { explanation: result, source };
}

export async function aiSuggest(input: AISuggestInput): Promise<{ suggestion: string; source: string }> {
  const prompt = buildSuggestionPrompt({
    moduleId: input.moduleId,
    skillScores: input.skillScores,
  });

  const { result, source } = await callAIWithReview(prompt);
  return { suggestion: result, source };
}

export async function aiEncourage(input: AIEncourageInput): Promise<{ message: string; source: string }> {
  const correctCount = input.recentPerformance.filter((r) => r.correct).length;
  const totalCount = input.recentPerformance.length;

  const prompt = `The student got ${correctCount}/${totalCount} correct recently. Write a warm, encouraging message celebrating their effort and motivating them to keep learning.`;

  const { result, source } = await callAIWithReview(prompt);
  
  // 如果 AI 不可用，使用规则引擎的鼓励语
  if (source === "rule") {
    return {
      message: pickEncouragement({ correctCount, totalCount }),
      source: "rule",
    };
  }
  
  return { message: result, source };
}

/**
 * 获取所有 Provider 的健康状态
 */
export async function getProviderHealthStatus(): Promise<Array<{
  id: string;
  name: string;
  priority: number;
  enabled: boolean;
  health: { available: boolean; latencyMs?: number; error?: string };
}>> {
  const status = await modelManager.getHealthStatus();
  return status.map(({ provider, health }) => ({
    id: provider.id,
    name: provider.name,
    priority: provider.priority,
    enabled: provider.enabled,
    health,
  }));
}
