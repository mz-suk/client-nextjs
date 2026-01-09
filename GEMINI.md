# GEMINI.md - Project Context & Guidelines

## 1. Project Overview

**Name:** `client-nextjs`
**Type:** Web Application (Next.js 16 + React 19)
**Description:** A production-ready Next.js template utilizing a hybrid FSD (Feature-Sliced Design) and DDD (Domain-Driven Design) architecture. It emphasizes scalability, type safety, and efficient state management.

## 2. Tech Stack

- **Framework:** Next.js 16.1.1 (App Router, Turbopack)
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
│   └── [routes]/ # Route-specific page and layout files
├── core/         # Infrastructure & Shared Configuration
│   ├── api/      # Fetch-based Client, Interceptors, Error handling
│   ├── config/   # Environment variables, Constants
│   ├── lib/      # Logger, Query/Mutation Factories, PrefetchBoundary
│   └── types/    # Core Type Definitions
├── domains/      # Business Logic (Domain-Driven)
│   └── [domain]/
│       ├── model/    # Logic (API, Types, Queries, Mutations, Stores)
│       ├── hooks/    # View Logic (Custom Hooks bridging model and UI)
│       ├── ui/       # Presentation (Components, Styles ONLY)
│       └── index.ts  # Public API Barrier (Exports only what's needed)
└── shared/       # Cross-cutting Concerns
    ├── ui/       # Reusable UI Components (Button, BottomSheet, VirtualList)
    ├── hooks/    # Shared Hooks & Stores (useIntersectionObserver, useVirtualScrollStore, etc.)
    ├── providers/# Global Context Providers (QueryProvider, AuthProvider)
    └── assets/   # Static assets and global styles
        ├── fonts/
        └── styles/   # Mixins, Variables, Reset, Global styles
```

> **Note:** New domains must strictly follow the `model` -> `hooks` -> `ui` separation.

## 4. Key Patterns & Conventions

### Data Fetching (TanStack Query)

- **Factory Pattern:** Use `createQuery`, `createInfiniteQuery`, and `createQueryKeys` from `@core/lib/query-factory`.
- **Server Prefetching:** Use `PrefetchBoundary` from `@core/lib` for a declarative approach to server-side prefetching.
- **Client-Side:** Use custom hooks from `domains/[domain]/hooks` which wrap `useQuery` / `useInfiniteQuery`.

### API Client (`@core/api`)

- **Custom Fetch Wrapper:** A robust `ApiClient` class wrapping native `fetch`.
- **Features:**
  - Automatic `Authorization` header injection (Server & Client compatible).
  - 401 Token Refresh mechanism.
  - Timeout and Abort handling.
  - Standardized `ApiError` hierarchy.

### Error Handling

- **Global:** `GlobalErrorHandler` catches unhandled promise rejections and boundary errors, displaying toasts.
- **API Errors:**
  - `401`: Auto-refresh token.
  - `5xx`: Trigger global toast or error boundary.
  - `4xx`: Handled locally (e.g., form validation) or via global toast.

### Component & Styling

- **SCSS Modules:** `import styles from './Component.module.scss'`.
- **Naming:** PascalCase for components, camelCase for logic/hooks/styles.
- **Headless UI:** Prefer `@base-ui/react` for accessible primitives, styled with custom SCSS.

## 5. Development Workflow

### Commands

- **Install:** `pnpm install`
- **Dev Server:** `pnpm dev`
- **Build:** `pnpm build`
- **Lint & Type Check:** `pnpm lint` (Runs `tsc` and `eslint`)
- **Format:** `pnpm format` (Prettier)
- **Analyze:** `pnpm analyze` (Bundle size analysis)
- **Clean:** `pnpm clean:empty` (Removes empty directories)

### File Naming

- **Pages/Layouts:** `page.tsx`, `layout.tsx`
- **Components:** `PascalCase.tsx`
- **Styles:** `Component.module.scss`
- **Hooks:** `useHookName.ts`
- **Queries/Mutations:** `domain.queries.ts`, `domain.mutations.ts`

## 6. Implementation Guidelines for AI

- **Domain Isolation:** Always check if a feature belongs to an existing domain. If new, create a new folder in `domains/`.
- **Strict Layer Separation:**
  - **Logic (`model`):** API calls, Zod schemas, Zustand stores, Query options.
  - **View Logic (`hooks`):** Custom hooks bridging model and UI.
  - **Presentation (`ui`):** React components and SCSS modules ONLY.
- **Code Quality:**
  - Use `pnpm lint` to verify changes before completion.
  - Prefer functional programming patterns and strict typing.
- **Documentation:** Refer to `docs/` for detailed guides on specific features.