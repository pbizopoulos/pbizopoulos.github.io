export default {
  packageManager: "npm",
  reporters: ["html", "clear-text", "progress", "json"],
  testRunner: "vitest",
  vitest: {
    configFile: "vitest.config.ts",
  },
  checkers: ["typescript"],
  tsconfigFile: "tsconfig.json",
  mutate: [
    "lib/**/*.ts",
    "components/**/*.tsx",
    "app/**/*.tsx",
    "!**/*.test.{ts,tsx}",
    "!**/*.spec.{ts,tsx}",
  ],
  ignorePatterns: [
    "result",
    "node_modules",
    ".next",
    "coverage",
    "reports",
    ".stryker-tmp",
  ],
  thresholds: { high: 80, low: 60, break: 0 },
};
