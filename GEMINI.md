# Gemini Code Assistant Context

## Project Overview

This is a Next.js 15 client application for the Incheon Duty Free Shop API. It's built with TypeScript and follows the Feature-Sliced Design (FSD) architecture for scalability and maintainability. The project utilizes modern frontend technologies like React 19, SWR for data fetching, and Turbopack for a fast development experience.

A key feature of this project is its integration with Apidog MCP (Model Context Protocol), which allows for AI-powered generation of API clients, hooks, and UI components based on an OpenAPI specification.

The application supports various rendering strategies, including:

- **SSG (Static Site Generation):** For pages with static content.
- **Hybrid (SSG + SWR):** The recommended approach, providing a fast initial load with dynamic data updates on the client-side.
- **CSR (Client-Side Rendering):** For pages that require user authentication or display real-time data.

## Building and Running

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Installation

```bash
pnpm install
```

### Environment Variables

Create a `.env.development` file with the following content:

```
NEXT_PUBLIC_API_URL=/api/proxy
API_TARGET_URL=https://dev-api.incheondfs.kr
NEXT_PUBLIC_API_TIMEOUT=30000
NEXT_PUBLIC_FEATURE_DEBUG=true
```

### Running the Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

### Building for Production

```bash
pnpm build
```

### Running in Production

```bash
pnpm start
```

The application will run on port 4000.

## Key Scripts

- `pnpm dev`: Starts the development server with Turbopack.
- `pnpm build`: Creates a production build.
- `pnpm start`: Starts the production server.
- `pnpm lint`: Lints the code using ESLint and TypeScript.
- `pnpm format`: Formats the code with Prettier.

## Development Conventions

### Architecture

The project follows the Feature-Sliced Design (FSD) architecture. The main layers are:

- `app`: The application layer, responsible for routing and page composition.
- `features`: Business logic features, each containing its own API calls, hooks, and UI components.
- `entities`: Business entities and their types.
- `shared`: Reusable code, such as API clients, configuration, and utility functions.

### Code Style

- Code is written in TypeScript with strict mode enabled.
- Code is formatted with Prettier and linted with ESLint.
- Git hooks (Husky + lint-staged) are used to enforce code style on commit.

### API Integration

- The project uses Axios for HTTP requests and SWR for data fetching and caching.
- Apidog MCP is used for AI-powered code generation. See `Apidog.md` for more details.
- In development, a proxy is configured in `next.config.ts` to avoid CORS issues.
