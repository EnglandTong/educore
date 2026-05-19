// ==================== Ollama Provider ====================
// 本地模型 Provider，支持树莓派离线运行
// 参考竞品分析：Ollama + llama.cpp ARM64 Neon 优化

import { ModelProvider, GenerateOptions, ChatOptions, GenerateResult, ProviderHealth, EmbeddingOptions, EmbeddingResult } from "./types.js";
import { env } from "../../../config/env.js";

export class OllamaProvider implements ModelProvider {
  readonly id = "ollama";
  readonly name = "Ollama (本地模型)";
  readonly priority = 10; // 本地模型优先级最高
  enabled: boolean;
  
  private baseUrl: string;
  private model: string;
  
  constructor() {
    this.baseUrl = env.OLLAMA_BASE_URL || "http://localhost:11434";
    this.model = env.OLLAMA_MODEL || "qwen2.5:1.8b-instruct-q4_K_M";
    this.enabled = !!env.OLLAMA_ENABLED;
  }
  
  async generate(options: GenerateOptions): Promise<GenerateResult | null> {
    if (!this.enabled) return null;
    
    const startTime = Date.now();
    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: this.model,
          prompt: options.prompt,
          stream: false,
          options: {
            num_predict: options.maxTokens || 500,
            temperature: options.temperature ?? 0.7,
          },
        }),
        signal: AbortSignal.timeout(options.timeoutMs || 30000),
      });
      
      if (!response.ok) return null;
      
      const data = (await response.json()) as {
        response?: string;
        model?: string;
        eval_count?: number;
      };
      
      return {
        text: data.response || "",
        model: data.model || this.model,
        tokensUsed: data.eval_count,
        latencyMs: Date.now() - startTime,
      };
    } catch {
      return null;
    }
  }
  
  async chat(options: ChatOptions): Promise<GenerateResult | null> {
    if (!this.enabled) return null;
    
    const startTime = Date.now();
    try {
      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: this.model,
          messages: options.messages,
          stream: false,
          options: {
            num_predict: options.maxTokens || 500,
            temperature: options.temperature ?? 0.7,
          },
        }),
        signal: AbortSignal.timeout(options.timeoutMs || 30000),
      });
      
      if (!response.ok) return null;
      
      const data = (await response.json()) as {
        message?: { content?: string };
        model?: string;
        eval_count?: number;
      };
      
      return {
        text: data.message?.content || "",
        model: data.model || this.model,
        tokensUsed: data.eval_count,
        latencyMs: Date.now() - startTime,
      };
    } catch {
      return null;
    }
  }
  
  async embeddings(options: EmbeddingOptions): Promise<EmbeddingResult | null> {
    if (!this.enabled) return null;
    
    const texts = Array.isArray(options.text) ? options.text : [options.text];
    const embeddings: number[][] = [];
    
    for (const text of texts) {
      try {
        const response = await fetch(`${this.baseUrl}/api/embeddings`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: this.model,
            prompt: text,
          }),
          signal: AbortSignal.timeout(15000),
        });
        
        if (!response.ok) return null;
        
        const data = (await response.json()) as { embedding?: number[] };
        if (data.embedding) {
          embeddings.push(data.embedding);
        }
      } catch {
        return null;
      }
    }
    
    return {
      embeddings,
      model: this.model,
    };
  }
  
  async healthCheck(): Promise<ProviderHealth> {
    if (!this.enabled) {
      return { available: false, error: "Ollama provider is disabled" };
    }
    
    const startTime = Date.now();
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        method: "GET",
        signal: AbortSignal.timeout(5000),
      });
      
      if (response.ok) {
        return {
          available: true,
          latencyMs: Date.now() - startTime,
        };
      }
      
      return { available: false, error: `HTTP ${response.status}` };
    } catch (err) {
      return {
        available: false,
        error: err instanceof Error ? err.message : "Unknown error",
      };
    }
  }
}

// 单例导出
export const ollamaProvider = new OllamaProvider();
