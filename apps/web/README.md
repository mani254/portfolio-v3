# Public Web Frontend

This application is the public-facing platform for the portfolio, utilizing Next.js, Radix UI, and Framer Motion.

## Folder Structure
- `app/`: Next.js 13+ App router with server and client components.
- `components/`: Reusable, modular UI components.
- `hooks/`: Custom interactive logic to keep components clean.
- `utils/`: Functions separating logic from views, like formatting dates using `date-fns`.
- `lib/`: Integrations with external services (e.g., Sanity, Googleapis).

## Development
Execute `pnpm --filter web dev` from the repository root to start up the web server locally.
