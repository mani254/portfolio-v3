import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

/**
 * Next.js ESLint flat config — extends Next.js core-web-vitals + TypeScript.
 * Used by apps/web and any other Next.js application.
 *
 * Usage in your app's eslint.config.mjs:
 *
 *   import next from "eslint-config/next";
 *   export default next;
 *
 * To extend with app-specific rules:
 *
 *   import next from "eslint-config/next";
 *   import { defineConfig } from "eslint/config";
 *
 *   export default defineConfig([
 *     ...next,
 *     { rules: { "no-console": "warn" } },
 *   ]);
 */
const config = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "dist/**",
    "next-env.d.ts",
    "node_modules/**",
  ]),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "no-console": ["warn", { allow: ["warn", "error", "info"] }],
    },
  },
]);

export default config;
