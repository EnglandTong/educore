// ==================== 模型管理器 ====================
// 参考竞品分析结论：AI + 规则引擎混合架构
// 自动按优先级尝试各个 Provider，直到成功

import { ModelProvider, GenerateOptions, ChatOptions, GenerateResult, ProviderHealth, EmbeddingOptions, EmbeddingResult } from "./types.js";
import { ollamaProvider } from "./ollama.js";
import { arkProvider } from "./ark.js";
import { FALLBACK_RESPONSES } from "../prompt-templates.js";

/**
 * 带规则引擎兜底的 Provider
 * 当所有 AI Provider 都不可用时，使用规则引擎返回预设回复
 */
class RuleEngineProvider implements ModelProvider {
  readonly id = "rule";
  readonly name = "规则引擎 (兜底)";
  readonly priority = 999; // 最后兜底
  enabled = true;
  
  async generate(options: GenerateOptions): Promise<GenerateResult | null> {
    // 简单的关键词匹配规则引擎
    const prompt = options.prompt.toLowerCase();
    
    if (prompt.includes("鼓励") || prompt.includes("加油") || prompt.includes("encourage")) {
      return {
        text: FALLBACK_RESPONSES.chat,
        model: "rule-engine",
        latencyMs: 1,
      };
    }
    
    if (prompt.includes("解释") || prompt.includes("explain")) {
      return {
        text: FALLBACK_RESPONSES.explain,
        model: "rule-engine",
        latencyMs: 1,
      };
    }
    
    // 默认兜底回复
    return {
      text: FALLBACK_RESPONSES.chat,
      model: "rule-engine",
      latencyMs: 1,
    };
  }
  
  async chat(options: ChatOptions): Promise<GenerateResult | null> {
    const lastMessage = options.messages[options.messages.length - 1]?.content || "";
    return this.generate({ prompt: lastMessage });
  }
  
  async healthCheck(): Promise<ProviderHealth> {
    return { available: true, latencyMs: 1 };
  }
}

const ruleProvider = new RuleEngineProvider();

/**
 * 模型管理器
 * 按优先级顺序尝试各个 Provider，直到找到可用的
 */
class ModelManager {
  private providers: ModelProvider[];
  
  constructor() {
    // 按优先级排序：Ollama (本地) → Ark (云端) → 规则引擎 (兜底)
    this.providers = [ollamaProvider, arkProvider, ruleProvider];
  }
  
  /**
   * 获取所有 Provider
   */
  getProviders(): ModelProvider[] {
    return [...this.providers];
  }
  
  /**
   * 获取可用的 Provider（按优先级排序）
   */
  async getAvailableProviders(): Promise<ModelProvider[]> {
    const available: ModelProvider[] = [];
    
    for (const provider of this.providers) {
      if (!provider.enabled) continue;
      
      const health = await provider.healthCheck();
      if (health.available) {
        available.push(provider);
      }
    }
    
    // 规则引擎总是可用，确保至少有一个
    if (available.length === 0) {
      available.push(ruleProvider);
    }
    
    return available.sort((a, b) => a.priority - b.priority);
  }
  
  /**
   * 生成文本（自动 fallback）
   */
  async generate(options: GenerateOptions): Promise<{ result: GenerateResult; providerId: string }> {
    const providers = await this.getAvailableProviders();
    
    for (const provider of providers) {
      try {
        const result = await provider.generate(options);
        if (result && result.text.trim()) {
          return { result, providerId: provider.id };
        }
      } catch {
        // 这个 Provider 失败了，试下一个
        continue;
      }
    }
    
    // 理论上不会到这里，因为规则引擎永远不会失败
    return {
      result: {
        text: FALLBACK_RESPONSES.chat,
        model: "fallback",
        latencyMs: 1,
      },
      providerId: "fallback",
    };
  }
  
  /**
   * 对话生成（自动 fallback）
   */
  async chat(options: ChatOptions): Promise<{ result: GenerateResult; providerId: string }> {
    const providers = await this.getAvailableProviders();
    
    for (const provider of providers) {
      try {
        const result = await provider.chat(options);
        if (result && result.text.trim()) {
          return { result, providerId: provider.id };
        }
      } catch {
        continue;
      }
    }
    
    return {
      result: {
        text: FALLBACK_RESPONSES.chat,
        model: "fallback",
        latencyMs: 1,
      },
      providerId: "fallback",
    };
  }
  
  /**
   * 嵌入向量（支持的 Provider 才处理）
   */
  async embeddings(options: EmbeddingOptions): Promise<{ result: EmbeddingResult | null; providerId: string }> {
    const providers = await this.getAvailableProviders();
    
    for (const provider of providers) {
      if (!provider.embeddings) continue;
      
      try {
        const result = await provider.embeddings(options);
        if (result) {
          return { result, providerId: provider.id };
        }
      } catch {
        continue;
      }
    }
    
    return { result: null, providerId: "none" };
  }
  
  /**
   * 获取所有 Provider 的健康状态
   */
  async getHealthStatus(): Promise<Array<{ provider: ModelProvider; health: ProviderHealth }>> {
    const results: Array<{ provider: ModelProvider; health: ProviderHealth }> = [];
    
    for (const provider of this.providers) {
      const health = await provider.healthCheck();
      results.push({ provider, health });
    }
    
    return results;
  }
}

// 单例导出
export const modelManager = new ModelManager();
