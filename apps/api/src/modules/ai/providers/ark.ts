// ==================== Ark Provider ====================
// 腾讯云 Ark API Provider，作为本地模型的 fallback

import { ModelProvider, GenerateOptions, ChatOptions, GenerateResult, ProviderHealth } from "./types.js";
import { env } from "../../../config/env.js";

export class ArkProvider implements ModelProvider {
  readonly id = "ark";
  readonly name = "腾讯云 Ark (云端模型)";
  readonly priority = 20; // 云端次之
  enabled: boolean;
  
  private baseUrl: string;
  private apiKey: string;
  private model: string;
  
  constructor() {
    this.baseUrl = env.ARK_BASE_URL || "";
    this.apiKey = env.ARK_API_KEY || "";
    this.model = env.ARK_MODEL || "";
    this.enabled = !!this.baseUrl && !!this.apiKey && !!this.model;
  }
  
  async generate(options: GenerateOptions): Promise<GenerateResult | null> {
    if (!this.enabled) return null;
    
    const startTime = Date.now();
    try {
      const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [{ role: "user", content: options.prompt }],
          max_tokens: options.maxTokens || 500,
          temperature: options.temperature ?? 0.7,
        }),
        signal: AbortSignal.timeout(options.timeoutMs || 15000),
      });
      
      if (!response.ok) return null;
      
      const data = (await response.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
        model?: string;
        usage?: { total_tokens?: number };
      };
      
      return {
        text: data.choices?.[0]?.message?.content || "",
        model: data.model || this.model,
        tokensUsed: data.usage?.total_tokens,
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
      const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: options.messages,
          max_tokens: options.maxTokens || 500,
          temperature: options.temperature ?? 0.7,
        }),
        signal: AbortSignal.timeout(options.timeoutMs || 15000),
      });
      
      if (!response.ok) return null;
      
      const data = (await response.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
        model?: string;
        usage?: { total_tokens?: number };
      };
      
      return {
        text: data.choices?.[0]?.message?.content || "",
        model: data.model || this.model,
        tokensUsed: data.usage?.total_tokens,
        latencyMs: Date.now() - startTime,
      };
    } catch {
      return null;
    }
  }
  
  async healthCheck(): Promise<ProviderHealth> {
    if (!this.enabled) {
      return { available: false, error: "Ark provider is disabled" };
    }
    
    const startTime = Date.now();
    try {
      // 用一个简单的测试请求做健康检查
      const response = await fetch(`${this.baseUrl}/v1/models`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${this.apiKey}` },
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
export const arkProvider = new ArkProvider();
