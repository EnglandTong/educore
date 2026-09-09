/**
 * Ephemeral mock Ollama HTTP server for M87 hardware-path simulation.
 * Does not require a real Raspberry Pi or host Ollama on :11434.
 */
import http from "node:http";
import type { AddressInfo } from "node:net";

export type SimOllamaMode = "ok" | "slow" | "down";

export interface SimOllamaOptions {
  mode: SimOllamaMode;
  /** Artificial delay for /api/generate and /api/chat (ms). */
  delayMs?: number;
  responseText?: string;
}

export interface SimOllamaHandle {
  baseUrl: string;
  mode: SimOllamaMode;
  close: () => Promise<void>;
}

function json(res: http.ServerResponse, status: number, body: unknown) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(payload),
  });
  res.end(payload);
}

async function readBody(req: http.IncomingMessage): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString("utf8");
}

export async function startSimOllama(options: SimOllamaOptions): Promise<SimOllamaHandle> {
  const delayMs = options.delayMs ?? 0;
  const responseText = options.responseText ?? "simulated-ollama-ok";

  if (options.mode === "down") {
    // Bind nothing useful: use a closed port pattern by starting then immediately
    // closing, and return a baseUrl that will refuse connections.
    const probe = http.createServer();
    await new Promise<void>((resolve) => probe.listen(0, "127.0.0.1", resolve));
    const { port } = probe.address() as AddressInfo;
    await new Promise<void>((resolve, reject) =>
      probe.close((err) => (err ? reject(err) : resolve())),
    );
    return {
      baseUrl: `http://127.0.0.1:${port}`,
      mode: "down",
      close: async () => undefined,
    };
  }

  const server = http.createServer((req, res) => {
    void (async () => {
      const url = req.url ?? "/";

      if (req.method === "GET" && url.startsWith("/api/tags")) {
        json(res, 200, { models: [{ name: "sim-qwen" }] });
        return;
      }

      if (
        req.method === "POST" &&
        (url.startsWith("/api/generate") || url.startsWith("/api/chat"))
      ) {
        await readBody(req);
        if (delayMs > 0) {
          await new Promise((r) => setTimeout(r, delayMs));
        }
        if (url.startsWith("/api/chat")) {
          json(res, 200, {
            message: { content: responseText },
            model: "sim-qwen",
            eval_count: 8,
          });
          return;
        }
        json(res, 200, {
          response: responseText,
          model: "sim-qwen",
          eval_count: 8,
        });
        return;
      }

      json(res, 404, { error: "not found" });
    })().catch(() => {
      if (!res.headersSent) {
        json(res, 500, { error: "sim-ollama internal error" });
      }
    });
  });

  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address() as AddressInfo;

  return {
    baseUrl: `http://127.0.0.1:${port}`,
    mode: options.mode,
    close: () =>
      new Promise<void>((resolve, reject) => {
        server.close((err) => (err ? reject(err) : resolve()));
      }),
  };
}
