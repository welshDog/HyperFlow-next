# Quickstart

Get Hyperflow Editor running in minutes.

## Prerequisites
- Node.js 20+
- A Supabase project or a Postgres database URL

## Setup
1. Copy environment file
   - Duplicate `.env.example` to `.env.local`
   - Fill:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `DATABASE_URL`
2. Install and run

```bash
npm install
npm run dev
# open http://localhost:3000
```

## Validate
```bash
npm run lint
npm run typecheck
npm run test
```

## First Flow
- Open the editor and create a simple node connection
- Toggle Zen Mode to reduce visual noise
- Check Version History and try a safe restore

### Visual
<figure>
  <img src="./assets/quickstart-flow.svg" alt="Diagram showing Start → Node A → Node B → Run → Output" style="max-width: 100%; height: auto;" />
  <figcaption>Quickstart sequence: create nodes, connect, run, and view output.</figcaption>
</figure>
