# Architecture

## Overview
- App Router (Next.js) provides pages and server actions
- Domain services encapsulate flow logic and versioning
- Lib utilities manage env validation, Prisma, Supabase, errors

### Diagram
<figure>
  <img src="./assets/architecture-overview.svg" alt="Blocks UI, Engine, HyperCode Language, Persistence, Tests connected by arrows" style="max-width: 100%; height: auto;" />
  <figcaption>High-level system map: UI and Engine feed Language; Persistence and Tests support the flow.</figcaption>
</figure>

## Module Map
- App: [layout.tsx](file:///c:/Users/lyndz/Downloads/My%20Hyper%20Agents/hyperflow-editor/src/app/layout.tsx), [page.tsx](file:///c:/Users/lyndz/Downloads/My%20Hyper%20Agents/hyperflow-editor/src/app/page.tsx)
- Components: [EditorCanvas.tsx](file:///c:/Users/lyndz/Downloads/My%20Hyper%20Agents/hyperflow-editor/src/components/EditorCanvas.tsx), [NodeCard.tsx](file:///c:/Users/lyndz/Downloads/My%20Hyper%20Agents/hyperflow-editor/src/components/NodeCard.tsx)
- Domain (Flow): [service.ts](file:///c:/Users/lyndz/Downloads/My%20Hyper%20Agents/hyperflow-editor/src/domain/flow/service.ts), [repository.ts](file:///c:/Users/lyndz/Downloads/My%20Hyper%20Agents/hyperflow-editor/src/domain/flow/repository.ts)
- Domain (Version): [service.ts](file:///c:/Users/lyndz/Downloads/My%20Hyper%20Agents/hyperflow-editor/src/domain/flowVersion/service.ts), [repository.ts](file:///c:/Users/lyndz/Downloads/My%20Hyper%20Agents/hyperflow-editor/src/domain/flowVersion/repository.ts)
- Lib: [env.ts](file:///c:/Users/lyndz/Downloads/My%20Hyper%20Agents/hyperflow-editor/src/lib/env.ts), [prisma.ts](file:///c:/Users/lyndz/Downloads/My%20Hyper%20Agents/hyperflow-editor/src/lib/prisma.ts), [supabaseClient.ts](file:///c:/Users/lyndz/Downloads/My%20Hyper%20Agents/hyperflow-editor/src/lib/supabaseClient.ts)

## Data Flow
1. User edits on canvas → creates/updates flow
2. Services validate via Zod → persist via Prisma/Supabase
3. Version History records immutable checkpoints
4. UI reflects changes with accessible controls

## Contracts
- Environment: validated by Zod schema in [env.ts](file:///c:/Users/lyndz/Downloads/My%20Hyper%20Agents/hyperflow-editor/src/lib/env.ts)
- Performance: budgets enforced via CI (Lighthouse)
- Accessibility: tests in [a11y.test.tsx](file:///c:/Users/lyndz/Downloads/My%20Hyper%20Agents/hyperflow-editor/src/components/__tests__/a11y.test.tsx)
