# Hyperflow Editor - Project Analysis & Summary

**Generated Date:** 2026-02-25
**Scope:** Root directory, Source Code, Configuration, Documentation

## 1. Executive Summary
Hyperflow Editor is a Next.js 16 (React 19) application designed as a visual workspace for building and versioning node-based data flows. It employs a Modular Monolith architecture with a clear separation of concerns (UI -> Server Actions -> Domain Services -> Persistence).

While the architectural foundation is robust—featuring strong typing, DDD-inspired layers, and comprehensive environment validation—the current state of the UI components (specifically `EditorCanvas`) appears to be in a prototyping phase, utilizing hardcoded mock data rather than integrating with the available backend services.

## 2. Technology Stack

### Frontend
- **Framework:** Next.js 16.1.4 (App Router)
- **Library:** React 19.2.3
- **Styling:** Tailwind CSS v4
- **Language:** TypeScript 5+ (Strict Mode)
- **State/Data:** React Server Actions (for mutations), potentially React Query (`@tanstack/react-query` is installed).

### Backend (Internal)
- **Runtime:** Node.js (via Next.js)
- **API Pattern:** Server Actions for RPC-like calls; Next.js API Routes for specific endpoints.
- **Database ORM:** Prisma Client 7.3.0
- **Database:** PostgreSQL
- **Auth:** Supabase Auth (SSR & Client)
- **Validation:** Zod 4.3.5

### Infrastructure & Operations
- **Containerization:** No `Dockerfile` or `docker-compose.yml` found in root (contrary to user instructions implying their existence or need).
- **CI/CD:** GitHub Actions (`.github/workflows/ci.yml`, `docs-check.yml`).
- **Testing:** Vitest (Unit), Playwright (E2E), Lighthouse (Performance).

## 3. Architecture & Code Organization

The project follows a **Domain-Driven Design (DDD) Lite** approach within a Next.js app:

- **`src/app/`**: Presentation Layer. Handles routing and composes views.
  - **`actions/`**: Application Service Layer. Entry points for mutations. Handles Auth checks (`hasAnyRole`) and Audit logging.
  - **`api/`**: Internal API endpoints (e.g., `admin`, `agents`, `orchestrator`).
- **`src/components/`**: UI Components. `EditorCanvas.tsx` is the core component but currently uses mock data.
- **`src/domain/`**: Domain Layer. Contains business logic (`service.ts`) and data access interfaces (`repository.ts`).
  - Modules: `flow`, `flowVersion`.
- **`src/lib/`**: Infrastructure Layer.
  - `prisma.ts`: DB connection.
  - `env.ts`: Zod-based environment variable validation and feature flags.
  - `rbac.ts`: Role-based access control.
- **`src/server/`**: Server-side modules (Agents, Orchestrator) that likely handle the execution logic or interface with external systems.

## 4. Key Features & Configuration

### "Hyper Super Powers" (Feature Flags)
The application relies heavily on feature flags defined in `src/lib/env.ts` but **undocumented in README**. Key flags include:
- `HYPER_ENABLE_POWERS`: Master toggle.
- `HYPER_ENABLE_AUTH_GUARDS`: Enforces RBAC.
- `HYPER_ENABLE_VERSIONING`: Toggles history features.
- `HYPER_KILL_SWITCH`: Emergency disable.
- `HYPER_PERF_BUDGET_...`: Performance thresholds.

### Data Model (Prisma)
- **Core:** `Flow` (1:N) -> `Node`, `Edge`.
- **Versioning:** `FlowVersion` stores JSON snapshots.
- **Survey Module:** `Survey`, `SurveyResponse`, `SurveyAnswer`.
- **System:** `AuditLog`, `UserProfile`, `Evaluation`.

## 5. Discrepancies & Gap Analysis

| Category | Finding | Status / Action Needed |
| :--- | :--- | :--- |
| **API Docs** | `README.md` lists endpoints like `/api/v2/editor/project` which do not exist in the Next.js `src/app/api` routes. | **Critical:** Likely refers to an external Python backend. Documentation needs clarification on the split between Next.js (Editor) and Python (Backend). |
| **UI Integration** | `EditorCanvas.tsx` uses hardcoded nodes (`n1`, `n2`) and does not fetch data from `src/app/actions/flows.ts`. | **High:** The core feature is not connected to the backend. |
| **Docker** | User instructions mention Docker/Compose, but no files exist in the root. | **High:** Need to create `Dockerfile` and `docker-compose.yml`. |
| **Documentation** | "Hyper Super Powers" (Env Vars) are missing from `README.md`. | **Medium:** Add table of `HYPER_*` env vars to docs. |
| **Backend** | README mentions "Editor ≥ 2.3.0 requires Backend ≥ 4.5.0", implying a separate service. | **Info:** Confirms distributed architecture (Frontend vs Execution Engine). |

## 6. Recommendations
1.  **Dockerize:** Create `Dockerfile` and `docker-compose.yml` to match the "User Instructions" and standardize dev environment.
2.  **Connect UI:** Update `EditorCanvas.tsx` to fetch flows via `src/app/actions/flows.ts` or React Query.
3.  **Update Docs:**
    - Clarify the API structure (Internal vs External).
    - Document the `HYPER_*` feature flags.
4.  **Backend Stub:** If the Python backend is external, ensure the Next.js app handles the missing connection gracefully or mocks it for dev.
