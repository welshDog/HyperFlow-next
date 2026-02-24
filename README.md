# Hyperflow Editor

<div align="center">
  <h3>Part of the <a href="https://github.com/welshDog/My-GitHub-CareTaker">HyperCode Ecosystem</a> 🧠✨</h3>
  <p>
    <em>Programming languages express how minds think. We're building one that thinks like <strong>US</strong>.</em>
  </p>
</div>


## Badges
- [![CI](https://img.shields.io/badge/CI-setup_pending-lightgrey)](file:///c:/Users/lyndz/Downloads/My%20Hyper%20Agents/hyperflow-editor/.github/workflows/ci.yml)
- [![Docs Check](https://img.shields.io/badge/Docs_Check-configured-blue)](file:///c:/Users/lyndz/Downloads/My%20Hyper%20Agents/hyperflow-editor/.github/workflows/docs-check.yml)

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
- Node.js 20+ and a package manager (npm, yarn, pnpm, or bun)
- A Supabase project (for auth/data) or a Postgres database URL
- Basic environment variables configured in a local file

## Getting Started
1. Clone the repo
   ```bash
   git clone <your-fork-or-repo>
   cd hyperflow-editor
   ```
2. Create your environment file
   - Copy `.env.example` to `.env.local`
   - Fill the placeholders (minimum):
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `DATABASE_URL`
   - Keep real secrets in `.env.local` (do not commit)
3. Install dependencies
   ```bash
   npm install
   ```
4. Run the app
   ```bash
   npm run dev
   # open http://localhost:3000
   ```
5. Optional: Quality checks
   ```bash
   npm run lint
   npm run typecheck
   npm run test
   npm run e2e
   ```

## What’s Inside
- Next.js (App Router), TypeScript, Tailwind
- Supabase client/server utilities, Prisma adapter for Postgres
- Zod‑validated environment setup
- CI pipeline: lint → typecheck → test → build → E2E → Lighthouse

## Auth & Backend Integration

- Required scopes: `editor:read`, `editor:write`
- REST endpoints (OpenAPI v3):
  - `POST /api/v2/editor/project`
  - `GET /api/v2/editor/project/{id}`
- WebSocket channel: `wss://<API_BASE>/editor/ws`

### Quick Start (.env.local)

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
DATABASE_URL=
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000/editor/ws
```

### Compatibility

- Editor ≥ 2.3.0 requires Backend ≥ 4.5.0
- Terminal ≥ 1.1.0 requires Backend ≥ 4.5.0

## Docs Index
- [Quickstart](file:///c:/Users/lyndz/Downloads/My%20Hyper%20Agents/hyperflow-editor/docs/quickstart.md)
- [Architecture](file:///c:/Users/lyndz/Downloads/My%20Hyper%20Agents/hyperflow-editor/docs/architecture.md)
- [Design Principles](file:///c:/Users/lyndz/Downloads/My%20Hyper%20Agents/hyperflow-editor/docs/design-principles.md)
- [Accessibility](file:///c:/Users/lyndz/Downloads/My%20Hyper%20Agents/hyperflow-editor/docs/accessibility.md)
- [Language](file:///c:/Users/lyndz/Downloads/My%20Hyper%20Agents/hyperflow-editor/docs/language.md)
- [Testing](file:///c:/Users/lyndz/Downloads/My%20Hyper%20Agents/hyperflow-editor/docs/testing.md)
- [Performance](file:///c:/Users/lyndz/Downloads/My%20Hyper%20Agents/hyperflow-editor/docs/performance.md)
- [Roadmap](file:///c:/Users/lyndz/Downloads/My%20Hyper%20Agents/hyperflow-editor/docs/roadmap.md)

## Friendly Analogy
It’s like building with LEGO: you snap together blocks to shape a flow. Hyperflow handles the instructions, safety checks, and a neat shelf of past versions — so you can experiment freely and revert confidently.


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
