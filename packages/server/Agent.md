# Server Agent Rules

This directory contains the Express.js Backend API server.

## Directory Structure
- **src/index.ts**: Main application entry point.
- **src/routes/**: Express route definitions.
- **src/controllers/**: Express controller logic.

## Rules
- All newly added routes must be defined and exported from `src/routes/` and injected in `src/index.ts`.
- Endpoints should use standard REST conventions.
- Make sure to use TypeScript effectively, importing shared definitions from `packages/types`.
