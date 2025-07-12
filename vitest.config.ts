import path from "path";
import react from "@vitejs/plugin-react";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["vitest-setup.ts"],
    coverage: {
      all: false,
      enabled: true,
      provider: "v8",
      reporter: ["text", "html", "clover", "json"],
      reportsDirectory: "coverage",
      thresholds: {
        autoUpdate: true,
      },
    },
    exclude: [...configDefaults.exclude, "test/**"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
