// ==================== AI 模型状态 Hook ====================
// 检测本地 Ollama 和云端 API 可用性，支持离线模式

import { useState, useEffect } from 'react';

export interface ProviderStatus {
  id: string;
  name: string;
  available: boolean;
  latencyMs?: number;
  error?: string;
}

export interface AIModelStatus {
  providers: ProviderStatus[];
  hasLocalModel: boolean;
  hasCloudModel: boolean;
  isOfflineMode: boolean;
  checking: boolean;
}

/**
 * 检测 Ollama 本地模型是否可用
 */
async function checkOllamaHealth(): Promise<ProviderStatus> {
  const baseUrl = import.meta.env.VITE_OLLAMA_BASE_URL || 'http://localhost:11434';
  
  try {
    const startTime = Date.now();
    const response = await fetch(`${baseUrl}/api/tags`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000),
      mode: 'cors',
    });
    
    if (response.ok) {
      return {
        id: 'ollama',
        name: 'Ollama (本地模型)',
        available: true,
        latencyMs: Date.now() - startTime,
      };
    }
    
    return {
      id: 'ollama',
      name: 'Ollama (本地模型)',
      available: false,
      error: `HTTP ${response.status}`,
    };
  } catch (err) {
    return {
      id: 'ollama',
      name: 'Ollama (本地模型)',
      available: false,
      error: err instanceof Error ? err.message : '连接失败',
    };
  }
}

/**
 * 检测后端 API + Provider 状态
 */
async function checkBackendProviders(apiBaseUrl: string): Promise<ProviderStatus[]> {
  try {
    const response = await fetch(`${apiBaseUrl}/ai/providers`, {
      method: 'GET',
      credentials: 'include',
      signal: AbortSignal.timeout(10000),
    });
    
    if (!response.ok) return [];
    
    const data = await response.json() as {
      data?: {
        providers?: Array<{
          id: string;
          name: string;
          health: { available: boolean; latencyMs?: number; error?: string };
        }>;
      };
    };
    
    return (data.data?.providers || []).map(p => ({
      id: p.id,
      name: p.name,
      available: p.health.available,
      latencyMs: p.health.latencyMs,
      error: p.health.error,
    }));
  } catch {
    return [];
  }
}

export function useAIModels(): AIModelStatus {
  const [status, setStatus] = useState<AIModelStatus>({
    providers: [],
    hasLocalModel: false,
    hasCloudModel: false,
    isOfflineMode: false,
    checking: true,
  });
  
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';
  
  useEffect(() => {
    async function checkProviders() {
      setStatus(prev => ({ ...prev, checking: true }));
      
      // 并行检测本地 Ollama 和后端 Provider 状态
      const [ollamaStatus, backendProviders] = await Promise.all([
        checkOllamaHealth(),
        checkBackendProviders(apiBaseUrl),
      ]);
      
      // 合并结果（去重）
      const providerMap = new Map<string, ProviderStatus>();
      
      // 先加后端返回的
      for (const p of backendProviders) {
        providerMap.set(p.id, p);
      }
      
      // 如果后端没返回 Ollama，用本地检测的
      if (!providerMap.has('ollama') || !providerMap.get('ollama')?.available) {
        providerMap.set('ollama', ollamaStatus);
      }
      
      const providers = Array.from(providerMap.values());
      const hasLocalModel = providers.some(p => p.id === 'ollama' && p.available);
      const hasCloudModel = providers.some(p => p.id === 'ark' && p.available);
      
      // 离线模式 = 有本地模型，且没有云端模型，或网络断开
      const isOfflineMode = hasLocalModel && navigator.onLine === false;
      
      setStatus({
        providers,
        hasLocalModel,
        hasCloudModel,
        isOfflineMode,
        checking: false,
      });
    }
    
    checkProviders();
    
    // 每 30 秒重新检测一次
    const interval = setInterval(checkProviders, 30000);
    return () => clearInterval(interval);
  }, [apiBaseUrl]);
  
  return status;
}

/**
 * 便捷 Hook：是否处于离线学习模式
 */
export function useIsOfflineLearning(): boolean {
  const { isOfflineMode } = useAIModels();
  return isOfflineMode;
}

/**
 * 便捷 Hook：获取当前可用的最快模型
 */
export function useFastestModel(): ProviderStatus | null {
  const { providers } = useAIModels();
  
  const available = providers.filter(p => p.available);
  if (available.length === 0) return null;
  
  // 按延迟排序，选最快的
  available.sort((a, b) => (a.latencyMs || 9999) - (b.latencyMs || 9999));
  return available[0] ?? null;
}
