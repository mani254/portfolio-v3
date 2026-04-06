# Portfolio v3 Monorepo

Welcome to the Portfolio v3 repository. This is a Turborepo-powered monorepo containing multiple applications and shared packages.

## Directory Structure
- `/apps/web`: The public-facing Next.js frontend application.
- `/apps/admin`: The Next.js admin dashboard.
- `/apps/studio`: The Sanity Studio CMS application.
- `/packages/server`: The Node.js Express backend API.
- `/packages/database`: MongoDB models and schemas.
- `/packages/eslint-config`: Shared ESLint configurations.
- `/packages/typescript-config`: Shared TypeScript compiler configurations.
- `/packages/sanity-lib`: Shared queries and utility configuration for Sanity CMS.
- `/packages/types`: Shared TypeScript definitions.

## Setup
To install dependencies, run `pnpm install` from this root directory. To run the development environment, execute `pnpm dev`.
