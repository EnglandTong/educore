/**
 * M87 hardware-path simulation gate.
 * Encodes Pi/Ollama constraint profiles without real hardware or host Ollama.
 */
import { afterEach, describe, expect, it } from "vitest";
import { OllamaProvider } from "../../src/modules/ai/providers/ollama.js";
import { ModelManager, RuleEngineProvider } from "../../src/modules/ai/providers/manager.js";
import { EDGE_PROFILE_IDS, EDGE_PROFILES } from "../fixtures/edge-profiles.js";
import { startSimOllama, type SimOllamaHandle } from "../helpers/sim-ollama.js";

const openSims: SimOllamaHandle[] = [];

afterEach(async () => {
  while (openSims.length > 0) {
    const handle = openSims.pop();
    if (handle) await handle.close();
  }
});

async function managerForProfile(profileId: (typeof EDGE_PROFILE_IDS)[number]): Promise<{
  manager: ModelManager;
  profile: (typeof EDGE_PROFILES)[typeof profileId];
}> {
  const profile = EDGE_PROFILES[profileId];
  const rule = new RuleEngineProvider();

  if (profileId === "offline-core") {
    return { manager: new ModelManager([rule]), profile };
  }

  if (!profile.ollamaAvailable) {
    const sim = await startSimOllama({ mode: "down" });
    openSims.push(sim);
    const ollama = new OllamaProvider({
      baseUrl: sim.baseUrl,
      enabled: true,
      model: "sim-qwen",
    });
    return { manager: new ModelManager([ollama, rule]), profile };
  }

  const sim = await startSimOllama({
    mode: profileId === "pi-slow" ? "slow" : "ok",
    delayMs: profile.ollamaDelayMs,
    responseText: "simulated-local-model-answer",
  });
  openSims.push(sim);

  const ollama = new OllamaProvider({
    baseUrl: sim.baseUrl,
    enabled: true,
    model: "sim-qwen",
  });
  return { manager: new ModelManager([ollama, rule]), profile };
}

describe("M87 ModelManager edge simulation profiles", () => {
  it("defines all four required profiles", () => {
    expect(EDGE_PROFILE_IDS.sort()).toEqual(
      ["offline-core", "pi-down", "pi-ok", "pi-slow"].sort(),
    );
  });

  it("pi-ok: uses simulated local model when healthy", async () => {
    const { manager, profile } = await managerForProfile("pi-ok");
    const started = Date.now();
    const { result, providerId } = await manager.generate({
      prompt: "encourage the student",
      timeoutMs: profile.clientTimeoutMs,
    });
    expect(providerId).toBe("ollama");
    expect(result.text.trim().length).toBeGreaterThan(0);
    expect(result.text).toContain("simulated-local-model-answer");
    expect(Date.now() - started).toBeLessThan(5_000);
  });

  it("pi-slow: degrades to rule engine within timeout instead of hanging", async () => {
    const { manager, profile } = await managerForProfile("pi-slow");
    const started = Date.now();
    const { result, providerId } = await manager.generate({
      prompt: "encourage the student",
      timeoutMs: profile.clientTimeoutMs,
    });
    const elapsed = Date.now() - started;
    expect(providerId).toBe("rule");
    expect(result.text.trim().length).toBeGreaterThan(0);
    // Must finish well under the simulated 3s delay + suite patience.
    expect(elapsed).toBeLessThan(2_500);
  });

  it("pi-down: skips unreachable local model and uses rule engine", async () => {
    const { manager, profile } = await managerForProfile("pi-down");
    const { result, providerId } = await manager.generate({
      prompt: "encourage the student",
      timeoutMs: profile.clientTimeoutMs,
    });
    expect(providerId).toBe("rule");
    expect(result.text.trim().length).toBeGreaterThan(0);
  });

  it("offline-core: rule engine only, always available", async () => {
    const { manager, profile } = await managerForProfile("offline-core");
    const { result, providerId } = await manager.generate({
      prompt: "encourage the student",
      timeoutMs: profile.clientTimeoutMs,
    });
    expect(providerId).toBe(profile.expectedProviderId);
    expect(result.text.trim().length).toBeGreaterThan(0);
    expect(result.model).toBe("rule-engine");
  });

  it("does not require host Ollama on :11434", async () => {
    // If this suite needed a live daemon, pi-down/pi-ok would fail in CI without :11434.
    const down = await managerForProfile("pi-down");
    const ok = await managerForProfile("pi-ok");
    const downResult = await down.manager.generate({
      prompt: "encourage",
      timeoutMs: down.profile.clientTimeoutMs,
    });
    const okResult = await ok.manager.generate({
      prompt: "encourage",
      timeoutMs: ok.profile.clientTimeoutMs,
    });
    expect(downResult.providerId).toBe("rule");
    expect(okResult.providerId).toBe("ollama");
  });
});
