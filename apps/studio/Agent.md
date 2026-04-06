# Studio Agent Rules

This directory handles the CMS implementation using Sanity.

## Directory Structure
- **schemas/**: Sanity content models and schema types.
- **sanity.config.ts**: The central Sanity Studio configuration.

## Rules
- Define all CMS schemas clearly, utilizing references to connect types.
- Any shared logic or queries utilized by frontend applications should typically be exposed in `packages/sanity-lib` instead of hardcoded inside the apps.
