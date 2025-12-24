# GEMINI.md

## Project Overview

This is a **Next.js 16 + React 19** project designed with a production-grade architecture combining **Feature-Sliced Design (FSD)** and **Domain-Driven Design (DDD)** principles. It utilizes **TypeScript 5.9**, **TanStack Query v5** for server state, **Zustand** for client state, and **Sass** for styling.

### Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Library**: React 19 (Server Components, use() hook, React Compiler)
- **Language**: TypeScript 5.9 (Strict mode)
- **State Management**:
  - Server: TanStack Query v5
  - Client: Zustand
- **Styling**: Sass (SCSS)
- **Validation**: Zod
- **Forms**: React Hook Form
- **Package Manager**: pnpm

## Getting Started

### Installation & Setup

```bash
# Install dependencies
pnpm install
```

### Development Scripts

```bash
# Start development server (http://localhost:3000)
pnpm dev

# Create a production build
pnpm build

# Start production server (http://localhost:4000)
pnpm start

# Linting & Formatting
pnpm lint
pnpm format

# Bundle Analysis
pnpm analyze
```

## Architecture

The project follows a hybrid FSD + DDD structure within `src/`:

```
src/
├── app/          # Next.js App Router (Pages, Layouts, Routing)
├── core/         # Infrastructure & Cross-cutting concerns
├── domains/      # Business Logic (Services, Hooks, Stores)
└── shared/       # Shared UI, Providers, Utils
```

### Directory Roles

- **`src/app/`**: Contains the routing logic, pages, layouts, and error boundaries. Keep logic minimal here; delegate to `domains`.
- **`src/core/`**: Foundational code used everywhere.
  - `api/`: `apiClient`, interceptors, error handling (`ApiError`, `AuthError`).
  - `config/`: Environment variables (`env`), constants.
  - `lib/`: Utilities like `logger`.
  - `types/`: Common type definitions (`Nullable`, `Optional`).
- **`src/domains/`**: Encapsulates business logic by domain (e.g., `auth`, `user`, `join`).
  - `services/`: Pure business logic and API calls.
  - `hooks/`: React hooks for data fetching (TanStack Query) or logic.
  - `stores/`: Zustand stores.
  - `types/`: Domain-specific types.
- **`src/shared/`**: Reusable components and logic not tied to a specific domain.
  - `ui/`: Generic UI components (BottomSheet, ErrorBoundary).
  - `providers/`: Global providers (AuthProvider, QueryProvider).
  - `styles/`: Global styles, mixins, variables.

## Development Conventions

### API Usage

Use the singleton `apiClient` from `@core/api`. **Do not** use `fetch` or `axios` directly in components.

```typescript
import { apiClient } from '@core/api';

// GET with type safety
const { data } = await apiClient.get<User>('/users/me');

// POST with type safety
const { data } = await apiClient.post<UserResponse>('/users', payload);
```

### State Management

- **Server State**: Use **TanStack Query** (via hooks in `domains/*/hooks`).
- **Client State**: Use **Zustand** (via stores in `domains/*/stores`) for global UI state or complex client-side logic.

### Logging

**Avoid `console.log`**. Use the `logger` utility from `@core/lib` for consistent formatting and level control.

```typescript
import { logger } from '@core/lib';

logger.debug('Debug info', { id: 1 });
logger.error('Something went wrong', error);
```

### Environment Variables

Access environment variables through the `env` object in `@core/config` to ensure type safety and validation.

```typescript
import { env } from '@core/config';

console.log(env.API_URL);
```

### Error Handling

Handle API errors using `ApiError` checks.

```typescript
import { ApiError } from '@core/api';

try {
  await someService.call();
} catch (error) {
  if (ApiError.isApiError(error)) {
    // Handle specific error codes or types
  }
}
```

### Import Aliases

Utilize the configured path aliases:

- `@core/*` -> `src/core/*`
- `@domains/*` -> `src/domains/*`
- `@shared/*` -> `src/shared/*`
- `@app/*` -> `src/app/*`
