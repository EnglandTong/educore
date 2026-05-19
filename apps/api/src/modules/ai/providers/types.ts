// ==================== 模型抽象层 - 类型定义 ====================
// 参考竞品分析结论：AI + 规则引擎混合架构，支持多 Provider 自动 fallback

/**
 * 模型消息类型
 */
export interface ModelMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/**
 * 生成请求参数
 */
export interface GenerateOptions {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
  timeoutMs?: number;
}

/**
 * 对话请求参数
 */
export interface ChatOptions {
  messages: ModelMessage[];
  maxTokens?: number;
  temperature?: number;
  timeoutMs?: number;
}

/**
 * 嵌入向量请求参数
 */
export interface EmbeddingOptions {
  text: string | string[];
}

/**
 * 生成响应结果
 */
export interface GenerateResult {
  text: string;
  model: string;
  tokensUsed?: number;
  latencyMs: number;
}

/**
 * 嵌入向量结果
 */
export interface EmbeddingResult {
  embeddings: number[][];
  model: string;
  tokensUsed?: number;
}

/**
 * Provider 健康状态
 */
export interface ProviderHealth {
  available: boolean;
  latencyMs?: number;
  error?: string;
}

/**
 * 模型 Provider 统一接口
 * 
 * 所有 Provider（Ollama、Ark、OpenAI、规则引擎）都实现此接口
 * 上层业务代码不需要关心底层用的是哪个模型
 */
export interface ModelProvider {
  /** Provider 唯一标识 */
  readonly id: string;
  
  /** Provider 显示名称 */
  readonly name: string;
  
  /** 优先级（越小越优先） */
  readonly priority: number;
  
  /** 是否启用 */
  enabled: boolean;
  
  /**
   * 文本生成
   */
  generate(options: GenerateOptions): Promise<GenerateResult | null>;
  
  /**
   * 对话生成
   */
  chat(options: ChatOptions): Promise<GenerateResult | null>;
  
  /**
   * 嵌入向量
   */
  embeddings?(options: EmbeddingOptions): Promise<EmbeddingResult | null>;
  
  /**
   * 健康检查
   */
  healthCheck(): Promise<ProviderHealth>;
}

/**
 * Provider 类型枚举
 */
export enum ProviderType {
  OLLAMA = "ollama",
  ARK = "ark",
  OPENAI = "openai",
  RULE_ENGINE = "rule",
}

/**
 * Provider 配置
 */
export interface ProviderConfig {
  type: ProviderType;
  enabled: boolean;
  priority: number;
  baseUrl?: string;
  apiKey?: string;
  model?: string;
}
