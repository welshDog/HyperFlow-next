# Hyperflow Editor

<div align="center">
  <h3>Part of the <a href="https://github.com/welshDog/My-GitHub-CareTaker">HyperCode Ecosystem</a> 🧠✨</h3>
  <p>
    <em>Programming languages express how minds think. We're building one that thinks like <strong>US</strong>.</em>
  </p>
</div>


## Badges
- [![CI](https://img.shields.io/badge/CI-setup_pending-lightgrey)](.github/workflows/ci.yml)
- [![Docs Check](https://img.shields.io/badge/Docs_Check-configured-blue)](.github/workflows/docs-check.yml)

Hyperflow Editor is a neurodivergent‑friendly visual workspace for building, versioning, and sharing node‑based data flows.

## Key Features
- Visual canvas with low‑distraction Zen Mode for focused editing
- Version History with safe restore and guardrails
- Accessible UI (keyboard navigation, semantic structure) and a11y checks
- Built‑in testing: Vitest unit tests, Playwright E2E and visual regression
- Performance budgets and monitoring hooks (Lighthouse/CI ready)
- Environment validation with Zod and configurable “Hyper Super Powers” toggles
- Works with Supabase/Postgres via Prisma for data operations

## Why It Matters
Think of Hyperflow like a whiteboard that remembers everything. You drag and connect blocks (nodes) to map how data moves, and the app keeps versions, checks accessibility, and protects you from breaking things. It’s designed to reduce cognitive load — clean visuals, consistent patterns, and quick feedback — so you can focus on ideas, not wrestling with tooling.

## When You’d Use It
- Prototype a data pipeline or transformation workflow
- Explain and document system behavior to non‑technical stakeholders
- Teach flow‑based thinking with live, visual examples
- Validate UI components and flows with tests and performance checks

## Prerequisites
- **Docker & Docker Compose** (Recommended)
- Node.js 20+ (for local development only)
- A Supabase project (for auth/data) or a Postgres database URL

## Getting Started (Docker)

This is the recommended way to run the application as it handles all dependencies including the database.

1. Clone the repo
   ```bash
   git clone <your-fork-or-repo>
   cd hyperflow-editor
   ```
2. Configure Environment
   - Create `.env.local` or ensure environment variables are set.
   - See [Configuration](./docs/configuration.md) for detailed options.
3. Run with Docker Compose
   ```bash
   docker compose up -d --build
   ```
4. Access the App
   - Open [http://localhost:3002](http://localhost:3002)

## Getting Started (Local Dev)

1. Install dependencies
   ```bash
   npm install
   ```
2. Set up environment
   - Copy `.env.example` to `.env.local`
   - Fill the placeholders (minimum):
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `DATABASE_URL`
3. Run the app
   ```bash
   npm run dev
   # open http://localhost:3000
   ```
4. Quality checks
   ```bash
   npm run lint
   npm run typecheck
   npm run test
   npm run e2e
   ```

## What’s Inside
- Next.js 16 (App Router), TypeScript, Tailwind v4
- Supabase client/server utilities, Prisma 7 for Postgres
- Zod‑validated environment setup
- **Hyper Super Powers**: Extensive feature flags for system control (see [Configuration](./docs/configuration.md))
- CI pipeline: lint → typecheck → test → build → E2E → Lighthouse

## Architecture & API

- **Internal API**: The application uses Next.js Server Actions and API Routes (`/api/...`) for internal operations.
- **External Integration**: Designed to integrate with the broader HyperCode Ecosystem via shared Docker networks (`hypercode_data_net`).
- **WebSockets**: Supports real-time collaboration (configured via `NEXT_PUBLIC_WS_URL`).

For more details, see [Architecture](./docs/architecture.md).

## Docs Index
- [Quickstart](./docs/quickstart.md)
- [Configuration](./docs/configuration.md) (New!)
- [Architecture](./docs/architecture.md)
- [Design Principles](./docs/design-principles.md)
- [Accessibility](./docs/accessibility.md)
- [Language](./docs/language.md)
- [Testing](./docs/testing.md)
- [Performance](./docs/performance.md)
- [Roadmap](./docs/roadmap.md)

## Friendly Analogy
It’s like building with LEGO: you snap together blocks to shape a flow. Hyperflow handles the instructions, safety checks, and a neat shelf of past versions — so you can experiment freely and revert confidently.
