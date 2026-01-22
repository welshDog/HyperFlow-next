import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import { URL } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}", "tests/**/*.spec.ts"],
    exclude: ["tests/e2e/**", "node_modules/**", "dist/**", "build/**"],
    coverage: {
      reporter: ["text", "json", "html"],
    },
  },
});
