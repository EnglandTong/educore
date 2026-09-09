/**
 * Edge / hardware constraint profiles for M87 simulation gate.
 * These encode Pi-like limits without requiring physical hardware.
 */

export type EdgeProfileId = "pi-ok" | "pi-slow" | "pi-down" | "offline-core";

export interface EdgeProfile {
  id: EdgeProfileId;
  description: string;
  /** Simulated local-model latency injected into SimOllama (ms). */
  ollamaDelayMs: number;
  /** Client timeout passed to generate/chat (ms). */
  clientTimeoutMs: number;
  /** Whether the simulated local model should accept connections. */
  ollamaAvailable: boolean;
  /** Expected winning provider id after degrade. */
  expectedProviderId: "ollama" | "rule";
}

export const EDGE_PROFILES: Record<EdgeProfileId, EdgeProfile> = {
  "pi-ok": {
    id: "pi-ok",
    description: "Local model healthy with modest Pi-like latency",
    ollamaDelayMs: 50,
    clientTimeoutMs: 5_000,
    ollamaAvailable: true,
    expectedProviderId: "ollama",
  },
  "pi-slow": {
    id: "pi-slow",
    description: "Local model too slow; must degrade within test timeout",
    ollamaDelayMs: 3_000,
    clientTimeoutMs: 200,
    ollamaAvailable: true,
    expectedProviderId: "rule",
  },
  "pi-down": {
    id: "pi-down",
    description: "Local model unreachable; skip to rule engine",
    ollamaDelayMs: 0,
    clientTimeoutMs: 2_000,
    ollamaAvailable: false,
    expectedProviderId: "rule",
  },
  "offline-core": {
    id: "offline-core",
    description: "No cloud, local down; rule engine only",
    ollamaDelayMs: 0,
    clientTimeoutMs: 2_000,
    ollamaAvailable: false,
    expectedProviderId: "rule",
  },
};

export const EDGE_PROFILE_IDS = Object.keys(EDGE_PROFILES) as EdgeProfileId[];
