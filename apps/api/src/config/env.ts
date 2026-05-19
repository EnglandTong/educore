import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(4000),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  HOST: z.string().default("0.0.0.0"),
  MONGODB_URI: z.string().url().or(z.string().startsWith("mongodb://")).default("mongodb://localhost:27017/educore"),
  REDIS_URL: z.string().url().or(z.string().startsWith("redis://")).default("redis://localhost:6379"),
  JWT_SECRET: z.string().min(16).default(
    process.env.NODE_ENV === 'production' ? '' : 'change-this-in-production'
  ),
  JWT_ACCESS_EXPIRY: z.string().default("15m"),
  JWT_REFRESH_EXPIRY: z.string().default("7d"),
  ARK_API_KEY: z.string().optional(),
  ARK_BASE_URL: z.string().url().default("https://ark.cn-beijing.volces.com/api/v3"),
  ARK_MODEL: z.string().optional(),
  // Ollama 本地模型配置（树莓派离线模式）
  OLLAMA_ENABLED: z.coerce.boolean().default(false),
  OLLAMA_BASE_URL: z.string().url().default("http://localhost:11434"),
  OLLAMA_MODEL: z.string().default("qwen2.5:1.8b-instruct-q4_K_M"),
  VITE_API_URL: z.string().url().default("http://localhost:4000/api/v1")
});

export type Env = z.infer<typeof envSchema>;

export const env = envSchema.parse(process.env);
