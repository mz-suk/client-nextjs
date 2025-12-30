# GEMINI.md - Project Context & Guidelines

## 1. Project Overview

**Name:** `client-nextjs`
**Type:** Web Application (Next.js 16 + React 19)
**Description:** A production-ready Next.js template utilizing a hybrid FSD (Feature-Sliced Design) and DDD (Domain-Driven Design) architecture. It emphasizes scalability, type safety, and efficient state management.

## 2. Tech Stack

- **Framework:** Next.js 16.1.0 (App Router, Turbopack)
- **Core:** React 19.2.3 (Server Components, React Compiler)
- **Language:** TypeScript 5.9.3 (Strict Mode)
- **State Management:**
  - **Server:** TanStack Query v5 (Caching, Auto-refetching, Infinite Queries)
  - **Client:** Zustand v5 (Global State)
- **Styling:** SCSS Modules (`*.module.scss`)
- **UI Libraries:** `@base-ui/react` (Headless), Custom Components (`VirtualList`, `BottomSheet`)
- **Forms & Validation:** React Hook Form + Zod
- **Package Manager:** pnpm (v10+)

## 3. Architecture Structure

The project follows a layered architecture to separate concerns effectively.

```
src/
├── app/          # Next.js App Router (Routing Only)
│   ├── layout.tsx, page.tsx, error.tsx, not-found.tsx
│   └── [routes]/
├── core/         # Infrastructure & Shared Configuration
│   ├── api/      # Fetch-based Client, Interceptors, Error handling
│   ├── config/   # Environment variables, Constants
│   ├── lib/      # Logger, Query Factories, Utils
│   └── types/    # Core Type Definitions
├── domains/      # Business Logic (Domain-Driven)
│   └── [domain]/
│       ├── model/    # Logic (API, Types, Queries, Mutations, Stores)
│       ├── ui/       # Presentation (Components, Hooks specific to domain)
│       └── index.ts  # Public API Barrier (Exports only what's needed)
└── shared/       # Cross-cutting Concerns
    ├── ui/       # Reusable UI Components (Button, BottomSheet, VirtualList)
    ├── hooks/    # Shared Hooks (useIntersectionObserver, etc.)
    ├── providers/# Global Context Providers (QueryProvider, AuthProvider)
    └── styles/   # Mixins, Variables, Reset, Fonts
```

> **Note:** New domains should strictly follow the `model` (logic) vs `ui` (view) separation.

## 4. Key Patterns & Conventions

### Data Fetching (TanStack Query)

- **Factory Pattern:** Use `createQuery`, `createInfiniteQuery`, and `createQueryKeys` from `@core/lib/query-factory` for type safety and consistency.
- **Server Prefetching:** Prefetch on server (`QueryClient.prefetchQuery`) -> Dehydrate -> Hydrate on client for SEO and initial performance.
- **Client-Side:** Use `useQuery` / `useInfiniteQuery` with the options factories.

### API Client (`@core/api`)

- **Custom Fetch Wrapper:** A robust `ApiClient` class wrapping native `fetch`.
- **Features:**
  - Automatic `Authorization` header injection (Server & Client).
  - 401 Token Refresh mechanism.
  - Timeout handling.
  - Standardized `ApiError` throwing.

### Error Handling

- **Global:** `GlobalErrorHandler` catches unhandled promise rejections and boundary errors.
- **API Errors:**
  - `401`: Auto-refresh token.
  - `5xx`: Trigger global error boundary or toast.
  - `4xx`: Handled locally in components (e.g., form errors).

### Component & Styling

- **SCSS Modules:** `import styles from './Component.module.scss'`.
- **Naming:** PascalCase for components, camelCase for logic/hooks.
- **Headless UI:** Prefer `@base-ui/react` for accessible primitives, styled with SCSS.

## 5. Development Workflow

### Commands

- **Install:** `pnpm install`
- **Dev Server:** `pnpm dev` (http://localhost:3000)
- **Build:** `pnpm build` (Static export by default in `next.config.ts`)
- **Production Start:** `pnpm start`
- **Lint & Type Check:** `pnpm lint`
- **Format:** `pnpm format`
- **Clean:** `pnpm clean:empty` (Removes empty directories)

### File Naming

- **Pages:** `page.tsx`
- **Layouts:** `layout.tsx`
- **Components:** `PascalCase.tsx`
- **Styles:** `Component.module.scss`
- **Hooks:** `useHookName.ts`
- **Queries/Mutations:** `domain.queries.ts`, `domain.mutations.ts`

## 6. Implementation Guidelines for AI

- **Domain Isolation:** Always check if a feature belongs to an existing domain. If new, create a new folder in `domains/`.
- **Strict Logic Separation:**
  - **Logic:** `domains/[domain]/model` (API calls, Zod schemas, Zustand stores, Query options).
  - **UI:** `domains/[domain]/ui` (React components, view-specific hooks).
- **Code Quality:**
  - Use `pnpm lint` to verify changes.
  - Prefer functional programming patterns.
  - Avoid `any`; use strict typing.
- **Documentation:** Check `docs/` for specific guides on Data Fetching, Error Handling, etc.
