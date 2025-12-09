# Brotherhood 2035 - AI Coding Agent Instructions

## Project Overview
Next.js 16 application (App Router) with React 19, TypeScript 5, and Tailwind CSS 4. Fresh setup with minimal customization - currently using the default Next.js template structure.

**Mission**: A dark, masculine self-improvement dashboard where users track fitness, wealth, habits, journaling, and mindset. The aesthetic is a private club lounge—whisky, cigars, mahogany—displaying only percentages and progress indicators, never raw numbers. Think exclusive, sophisticated, focused.

## Tech Stack
- **Framework**: Next.js 16.0.4 (App Router, Server Components by default)
- **React**: 19.2.0 (latest with React Compiler support)
- **Styling**: Tailwind CSS 4 (dark theme mandatory) + shadcn/ui components
- **TypeScript**: Strict mode enabled, using `@/*` path alias for root-level imports
- **Fonts**: Geist Sans & Geist Mono from next/font/google
- **Database**: SQLite + Prisma (dev), PostgreSQL via Railway (production migration planned)
- **Deployment**: Vercel (serverless, optimized for Next.js App Router)

## Project Structure
```
app/
  layout.tsx       # Root layout with font setup and metadata
  page.tsx         # Home page (Server Component)
  globals.css      # Tailwind imports + CSS custom properties for theming
public/            # Static assets (SVGs)
```

## Key Conventions

### Component Architecture
- **Default to Server Components**: All components in `app/` are Server Components unless you add `"use client"` directive
- **Client Components**: Only add `"use client"` when you need hooks (useState, useEffect), browser APIs, or event handlers
- Example from `app/page.tsx`: No client directive needed for static content with Next.js Image optimization

### Styling Patterns
- **Tailwind v4 syntax**: Import uses `@import "tailwindcss"` (not `@tailwind` directives)
- **CSS Custom Properties**: Define theme tokens in globals.css using `@theme inline` block
- **Dark mode**: Uses `prefers-color-scheme` media query, classes like `dark:bg-black`
  - **Theme mandate**: Dark theme is non-negotiable—masculine, club lounge aesthetic
  - Think rich browns, deep blacks, gold accents, leather textures
  - Display progress/percentages only, never raw numbers
- **Responsive**: Mobile-first with breakpoints (e.g., `sm:items-start`, `md:w-[158px]`)
- **Font variables**: Use `font-sans` (maps to --font-geist-sans) or `font-mono` in Tailwind classes

### TypeScript Configuration
- **Path alias**: Use `@/` to import from project root (e.g., `import { Component } from '@/components/ui'`)
- **Strict mode**: All TypeScript strict checks enabled
- **React JSX**: Uses modern `react-jsx` transform (no need to import React in files)
- **Module resolution**: `bundler` mode for Next.js compatibility

### ESLint Setup
- **Config format**: Uses new flat config format (eslint.config.mjs)
- **Next.js rules**: Includes `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`
- **Run linting**: `npm run lint` (uses ESLint 9)

## Developer Workflows

### Development
```bash
npm run dev          # Start dev server on http://localhost:3000
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
```

### File Creation
- **New pages**: Create folders in `app/` (e.g., `app/about/page.tsx` for /about route)
- **Layouts**: Add `layout.tsx` in route folders to wrap nested pages
- **API routes**: Create `route.ts` in `app/api/[endpoint]/` for API endpoints
- **Components**: Group by feature, not type (e.g., `components/dashboard/`, `components/checkin/`)
  - Avoid premature patterns—document structure once it stabilizes
  - Use shadcn/ui components as base, customize for dark masculine theme

### Image Optimization
- Use `next/image` component (not `<img>`)
- Static images in `public/` referenced with leading `/` (e.g., `/next.svg`)
- Always set `width` and `height` props for layout shift prevention
- Use `priority` prop for above-the-fold images

## Important Notes
- **React 19**: Be aware of new React features (Actions, use hook, etc.)
- **Metadata**: Export `metadata` object from page/layout files (see `app/layout.tsx`)
- **No custom configuration**: Next.js and PostCSS configs are minimal - avoid unnecessary complexity
- **Project naming**: "Brotherhood 2035" - consider this theme when adding features

## What's Not Here Yet
This is a fresh project. No:
- Database/ORM setup (SQLite + Prisma planned for dev, PostgreSQL via Railway for prod)
- Authentication (planned but not implemented)
- State management library
- Component library beyond basics (shadcn/ui will be added)
- API structure
- Testing setup
- Environment variables (no .env file)

When adding these, follow Next.js 16 App Router best practices and maintain the existing simplicity.
