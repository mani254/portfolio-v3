import studio from "@sanity/eslint-config-studio";

/**
 * Sanity Studio ESLint flat config.
 * Used by apps/studio.
 *
 * Usage in your studio's eslint.config.mjs:
 *
 *   import sanity from "eslint-config/sanity";
 *   export default sanity;
 */
const config = [...studio];

export default config;
