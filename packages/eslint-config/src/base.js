import js from "@eslint/js";
import tseslint from "typescript-eslint";

/**
 * Base ESLint flat config — TypeScript + JS best practices.
 * Used by internal packages (e.g. packages/database, packages/sanity-lib).
 *
 * Usage in your package's eslint.config.mjs:
 *
 *   import base from "eslint-config/base";
 *   export default base;
 */
const config = tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      // Allow unused vars prefixed with _ (common TS pattern)
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // Mongoose uses `any` in a few places — keep this as warn
      "@typescript-eslint/no-explicit-any": "warn",
      // Allow require() in config/scripts context
      "@typescript-eslint/no-require-imports": "off",
      "no-console": ["warn", { allow: ["warn", "error", "info"] }],
    },
  },
  {
    ignores: ["dist/**", "node_modules/**", "*.config.*"],
  }
);

export default config;
