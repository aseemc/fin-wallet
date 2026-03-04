# Financial Health Score Wallet

A prototype life-optimization wallet for tracking financial health, computing stability scores, and coordinating advisor guidance. Built as a take-home MVP demonstrating full-stack product thinking, AI integration, and clean architecture.

## Quick Start

```bash
git clone <repo-url> && cd fin-wallet
cp .env.example .env.local    # fill in your keys (see below)
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `OPENAI_API_KEY` | OpenAI API key (for AI recommendations) |

## Demo

### No-signup demo mode

Click **"Try Client Demo"** on `/login` or **"Try Advisor Demo"** on `/admin/login` to explore the full product with realistic seed data — no account required. Mutations are disabled with a visual banner.

### With accounts

- **Client**: Sign up at `/signup`, then enter financial data → view score → set a goal → receive recommendations
- **Advisor**: Sign up at `/admin/signup`, then browse clients → view financial snapshots → generate AI recommendations → edit & send

### Seeded demo accounts

For quick evaluation without signing up:

| Role | Email | Password |
|------|-------|----------|
| Client | `client@demo.com` | `demo1234` |
| Advisor | `advisor@demo.com` | `demo1234` |

## Features

### Client (mobile-web, touch-friendly)
- Financial Health Score (0–100) with color-coded display and transparent breakdown
- Score trend chart tracking progress over time
- Financial data entry (income, expenses, debt, savings) with auto score recomputation
- Goal setting with progress tracking
- Advisor recommendations with 3-step action flow (Acknowledge → Start → Complete)
- Light/dark mode toggle

### Advisor (desktop-optimized)
- Client list with health scores and status
- Client detail view: financial snapshot, score breakdown, goal progress, score trend
- AI-powered recommendation generation (GPT-4o-mini)
- Dual summaries: clinical advisor-facing risk assessment + warm client-facing message
- Editable recommendations with priority-tagged action items
- Draft → Send workflow with full status tracking

### AI Integration
- One-click generation of risk assessments + 3 prioritized action items
- Structured JSON output validated with Zod
- Advisor reviews and edits both summaries before sending
- Client only sees the encouraging, jargon-free message

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) + TypeScript |
| Database & Auth | Supabase (Postgres + Auth) |
| UI | shadcn/ui + Tailwind CSS v4 |
| Charts | Recharts (via shadcn charts) |
| State | TanStack React Query + React 19 `useOptimistic` |
| AI | OpenAI API (gpt-4o-mini) |
| Theme | next-themes (system/light/dark) |
| Validation | Zod |

## Why Supabase?

- **Relational data model** — FK constraints fit the financial profiles → scores → recommendations graph
- **JSONB columns** — flexible structured data for score breakdowns and action items
- **Built-in Auth** — session management via `@supabase/ssr` with zero extra infrastructure
- **Type generation** — end-to-end type safety from DB schema to React components
- **RLS-ready** — current auth is app-level middleware, but the table structure supports row-level security policies when needed

## Architecture Decisions

- **Server Components for reads, Server Actions for writes** — minimal client JS, fast initial loads
- **Score computed on write** — profile/goal updates trigger `computeAndStoreScore()`, stored as snapshots for trend tracking
- **Middleware-based auth** — session + role checks in Next.js middleware; demo mode via cookie bypass
- **Optimistic UI** — recommendation status actions use `useOptimistic` + `useTransition` for instant feedback
- **AI guardrails** — JSON mode, Zod validation, 0.3 temperature, mandatory advisor review before sending

## Project Structure

```
src/
├── app/
│   ├── (auth)/              # Client login/signup (no layout chrome)
│   ├── (client)/            # Client pages (mobile layout + bottom nav)
│   │   ├── data/            # Financial data form
│   │   ├── goal/            # Goal form
│   │   └── recommendations/ # Recommendation list + actions
│   └── admin/
│       ├── (auth)/          # Advisor login/signup
│       └── (dashboard)/     # Advisor pages (desktop sidebar layout)
│           └── client/[id]/ # Client detail + AI recommendation flow
├── actions/                 # Server actions (auth, profile, goals, recs, score)
├── components/              # Shared components + shadcn/ui
├── lib/                     # Utilities (Supabase clients, AI, score, demo data, types)
└── providers/               # React context (demo mode, React Query)
```

## What I'd Build Next

1. **Row-Level Security** — table structure already supports RLS; enable policies for defense-in-depth
2. **Multi-goal support** — allow clients to track multiple financial goals simultaneously
3. **Advisor-client assignment** — proper access control with multi-advisor model
4. **Score trend sparklines** — inline charts on the advisor client list for quick triage
5. **Push notifications** — alert clients when new recommendations arrive
6. **Unit/integration tests** — Jest + React Testing Library for critical flows
