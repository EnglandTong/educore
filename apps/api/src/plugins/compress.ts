import type { FastifyPluginAsync } from "fastify";
import { gzipSync } from "node:zlib";

const MIN_COMPRESS_BYTES = 1024;

export const compressionPlugin: FastifyPluginAsync = async (app) => {
  app.addHook("onSend", async (request, reply, payload) => {
    const acceptEncoding = String(request.headers["accept-encoding"] ?? "");
    if (!acceptEncoding.includes("gzip")) {
      return payload;
    }

    if (typeof payload !== "string" && !Buffer.isBuffer(payload)) {
      return payload;
    }

    const body = Buffer.isBuffer(payload) ? payload : Buffer.from(payload);
    if (body.length < MIN_COMPRESS_BYTES) {
      return payload;
    }

    reply.header("content-encoding", "gzip");
    reply.header("vary", "accept-encoding");
    return gzipSync(body);
  });
};
