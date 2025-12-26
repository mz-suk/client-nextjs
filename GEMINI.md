# GEMINI.md - Project Context & Guidelines

## 1. Project Overview

**Name:** `client-nextjs`
**Type:** Web Application (Next.js 16 + React 19)
**Description:** A production-ready Next.js template utilizing a hybrid FSD (Feature-Sliced Design) and DDD (Domain-Driven Design) architecture. It emphasizes scalability, type safety, and efficient state management.

## 2. Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Core:** React 19 (Server Components, React Compiler)
- **Language:** TypeScript 5.9 (Strict Mode)
- **State Management:**
  - **Server:** TanStack Query v5 (Caching, Auto-refetching)
  - **Client:** Zustand (Global State)
- **Styling:** SCSS Modules (`*.module.scss`)
- **Forms & Validation:** React Hook Form + Zod
- **Package Manager:** pnpm

## 3. Architecture Structure

The project follows a layered architecture to separate concerns effectively:

```
src/
├── app/          # Next.js App Router (Routing Only)
│   ├── layout.tsx, page.tsx, error.tsx, not-found.tsx
│   └── [routes]/
├── core/         # Infrastructure & Shared Configuration
│   ├── api/      # Axios client, Interceptors, Error handling
│   ├── config/   # Environment variables
│   └── lib/      # Logger, Utilities
├── domains/      # Business Logic (Domain-Driven)
│   └── [domain]/
│       ├── model/    # Logic (API, Types, Queries, Mutations)
│       ├── ui/       # Presentation (Components, Hooks)
│       └── index.ts  # Public API Barrier (Exports only what's needed)
└── shared/       # Cross-cutting Concerns
    ├── ui/       # Reusable UI Components (Button, BottomSheet)
    ├── providers/# Global Context Providers
    └── styles/   # Mixins, Variables, Reset
```

## 4. Key Patterns & Conventions

### Data Fetching (TanStack Query)

- **SSG + CSR (Recommended):** Prefetch on server (`QueryClient.prefetchQuery`) -> Dehydrate -> Hydrate on client.
- **CSR:** Use `useQuery` directly for private/real-time data.
- **Mutations:** Use `useMutation` with automatic cache invalidation (`queryClient.invalidateQueries`).

### Error Handling

- **Global:** 5xx, 401 (Auto-refresh), 403 (Redirect), Network Errors -> Handled by `GlobalErrorHandler`.
- **Local:** 400, 404, 422 (Business Logic) -> Handled within components/pages using `ApiError`.
- **Next.js:** `error.tsx` (Page level), `global-error.tsx` (Root level), `not-found.tsx` (404).

### API Client (`@core/api`)

- Centralized Axios instance with interceptors.
- Automatic token refresh mechanism for 401 errors.
- Typed responses.

### Component & Styling

- Components should be functional and typed.
- Styles using SCSS Modules: `import styles from './Component.module.scss'`.
- Use `domains/[domain]/index.ts` to expose domain functionality.

## 5. Development Workflow

### Commands

- **Install:** `pnpm install`
- **Dev Server:** `pnpm dev` (http://localhost:3000)
- **Build:** `pnpm build`
- **Production Start:** `pnpm start` (Runs build + start on port 4000)
- **Lint & Type Check:** `pnpm lint`
- **Analyze Bundle:** `pnpm analyze`

### File Naming

- **Pages:** `page.tsx`
- **Layouts:** `layout.tsx`
- **Components:** `PascalCase.tsx`
- **Styles:** `Component.module.scss`
- **Hooks:** `useHookName.ts`
- **Utils/Logic:** `camelCase.ts`

### Environment Variables

- Manage in `.env.local`.
- Keys: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_API_TIMEOUT`, `API_TARGET_URL` (SSR), etc.

## 6. Implementation Guidelines for AI

- **Adhere to FSD/DDD:** When adding features, place logic in `domains/[domain]/model` and UI in `domains/[domain]/ui`.
- **Strict Typing:** Always define interfaces for API responses and component props.
- **TanStack Query:** Prefer `queryOptions` factory pattern in `*.queries.ts` for consistency between Server and Client.
- **SCSS Modules:** Do not use global styles for components; strictly use modules.
- **Safety:** Always verify `package.json` scripts before running commands.
