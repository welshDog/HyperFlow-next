# Architecture

## Overview
- **App Router (Next.js)**: Provides pages, API routes, and Server Actions.
- **Docker Container**: Runs the Next.js application, fully integrated with the HyperCode ecosystem.
- **Domain Services**: Encapsulate business logic, validation, and versioning.
- **Lib Utilities**: Manage environment validation, Prisma (Postgres), Supabase (Auth), and RBAC.

### Diagram
<figure>
  <img src="./assets/architecture-overview.svg" alt="Blocks UI, Engine, HyperCode Language, Persistence, Tests connected by arrows" style="max-width: 100%; height: auto;" />
  <figcaption>High-level system map: UI and Engine feed Language; Persistence and Tests support the flow.</figcaption>
</figure>

## Infrastructure
The application is containerized using Docker and Orchestrated via Docker Compose.

- **Frontend/API**: Next.js container (Port 3002)
- **Database**: Postgres (via `hypercode_data_net`)
- **Cache**: Redis (via `hypercode_data_net`)
- **Auth**: Supabase (External or Self-Hosted)

## Module Map
- **App Layer**:
  - [layout.tsx](./src/app/layout.tsx): Root layout and providers.
  - [page.tsx](./src/app/page.tsx): Main entry point.
  - [actions/](./src/app/actions/): Server Actions for mutations (Flows, Survey).
  - [api/](./src/app/api/): Internal REST endpoints.
- **Components**:
  - [EditorCanvas.tsx](./src/components/EditorCanvas.tsx): Core flow editing surface.
  - [NodeCard.tsx](./src/components/NodeCard.tsx): Individual node UI.
- **Domain Layer**:
  - **Flow**: [service.ts](./src/domain/flow/service.ts), [repository.ts](./src/domain/flow/repository.ts)
  - **Version**: [service.ts](./src/domain/flowVersion/service.ts), [repository.ts](./src/domain/flowVersion/repository.ts)
- **Lib Layer**:
  - [env.ts](./src/lib/env.ts): Zod-validated configuration ("Hyper Super Powers").
  - [prisma.ts](./src/lib/prisma.ts): Database client.
  - [rbac.ts](./src/lib/rbac.ts): Role-Based Access Control.

## Data Flow
1. **User Action**: User edits on canvas or submits a form.
2. **Server Action**: Request sent to Next.js Server Action (e.g., `createFlow`).
3. **Validation**: Input validated against Zod schemas.
4. **Auth Check**: RBAC validates user permissions via Supabase token.
5. **Domain Logic**: Service layer executes business rules.
6. **Persistence**: Data saved to Postgres via Prisma.
7. **Audit**: Action logged to Audit table (if configured).

## Contracts
- **Environment**: Validated by Zod schema in [env.ts](./src/lib/env.ts).
- **Performance**: Budgets enforced via CI (Lighthouse) and runtime monitoring.
- **Accessibility**: Enforced via tests in [a11y.test.tsx](./src/components/__tests__/a11y.test.tsx).
