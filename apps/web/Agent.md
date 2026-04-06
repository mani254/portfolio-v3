# Web App Agent Rules

This directory contains the public-facing Web application, built with Next.js.

## Directory Structure
- **app/**: App Router components and layouts for the public site.
- **components/**: Shared visual components (e.g., buttons, navigation maps, layout shells).
- **hooks/**: Custom React hooks. Any UI interactivity logic or window-listening needs to live here.
- **utils/**: Data transformation and formatting utilities.
- **public/**: Images, fonts, and other static files for the website.

## Rules
- Always use the `/hooks` folder for encapsulating React state and side effect logic.
- Always use the `/utils` folder for general helper functions and repetitive transformations.
- Focus on performance, utilizing React Server Components in the `app/` directory where possible.
