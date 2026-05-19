import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    pool: "forks",
    testTimeout: 120000,
    hookTimeout: 120000,
  },
});
