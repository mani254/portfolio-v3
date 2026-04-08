# Monorepo Agent Rules

This directory is the root of the Portfolio v3 monorepo workspace.

## Global Structure
- **apps/**: Contains the main standalone applications (Admin Dashboard, Public Web, Sanity Studio).
- **packages/**: Contains shared libraries, configurations, and backend services (Server, Database, configs).

## Rules
- Use `pnpm` as the package manager.
- Always run scripts from the root using `turbo` when applicable.
- Dependencies shared across the monorepo should ideally go into their respective `packages/` so that code is not duplicated.
- Types that are uniquely used within a single module should reside there. If types are shared across the workspace (e.g., database schemas or common interfaces), define them centrally in `packages/database` or `packages/types` and import them across the monorepo (e.g. `import type { MessageRole } from 'database'`) to prevent duplication.
