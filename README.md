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
- Wallet switcher in header — Finance Wallet active, Health/Tax/Legal shown as "Coming Soon"
- Financial Health Score (0–100) with color-coded display and transparent breakdown
- Score trend chart tracking progress over time
- Financial data entry (income, expenses, debt, savings) with auto score recomputation
- Goal setting with progress tracking
- Advisor recommendations with 3-step action flow (Acknowledge → Start → Complete)
- Light/dark mode toggle

### Advisor (desktop-optimized)
- Vertical selection on first login (Finance enabled; Health, Tax, Legal coming soon)
- Dynamic branding — sidebar and header reflect the selected vertical ("Finance Wallet", "Health Wallet", etc.)
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

## Why This Design (Based on personal experience)

The core insight is that financial health is a **motivation problem**, not just a data problem. Clients — especially young professionals — don't need another spreadsheet; they need a score they can watch improve, goals that feel achievable, and guidance written in encouraging language rather than jargon.

The dual client/advisor model exists because AI alone isn't trustworthy enough for financial advice. Advisors provide the judgment layer: they review AI-generated recommendations, edit for context, and control when clients see them. This keeps the human in the loop while cutting per-client drafting time from ~30 minutes to under 2.

The client experience is mobile-first (web based for MVP) because that's where people check their finances. The advisor experience is desktop-optimized because that's where professionals work through a client list. Demo mode with realistic seed data lets evaluators experience both flows without signup friction.

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

This stack prioritizes developer velocity — I've shipped with this combination before and can move quickly without fighting tooling. Supabase in particular gives me Postgres, auth, and type generation out of the box, so I can focus on product logic instead of infrastructure.

## Key Tradeoffs

- **Server Components for reads, Server Actions for writes** — prioritized fast initial loads and minimal client JS over rich client-side interactivity; forms that need instant feedback use `useOptimistic` selectively
- **Score computed on write, not on read** — trades slightly slower profile/goal updates for instant score display and simple trend tracking via stored snapshots
- **App-level auth (middleware) instead of Row-Level Security** — faster to ship and easier to debug, at the cost of defense-in-depth; table structure is RLS-ready for hardening later
- **Single AI call with mandatory advisor review** — slower delivery to clients, but ensures accuracy and builds trust; avoids the risk of unreviewed AI advice reaching users
- **Structured AI output (JSON mode + Zod) at low temperature** — trades creative variation for predictable, parseable output the UI can reliably render
- **Demo mode via cookie bypass** — enables frictionless evaluation but required a parallel code path for seeded data that adds maintenance surface
- **Multi-vertical architecture built early** — `vertical` column, dynamic branding, and vertical selector add complexity now, but avoid a painful refactor when Health/Tax/Legal wallets ship

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

## What I'd Do with More Time

Engineering hardening, infrastructure, and features I'd build to move this from prototype to production.

1. **Row-Level Security** — table structure already supports RLS; enable policies for defense-in-depth
2. **Multi-goal support** — allow clients to track multiple financial goals simultaneously
3. **Push notifications** — alert clients when new recommendations arrive
4. **Unit/integration tests** — Jest + React Testing Library for critical flows
5. **Error tracking** — Sentry integration for real-time error monitoring and alerting
6. **User analytics** — Amplitude or Vercel Analytics for usage insights and funnel optimization
7. **Database indexing** — add composite indexes on high-traffic queries as the user base scales
8. **Quick Connect with advisor** — in-app scheduling or live chat for clients to reach their advisor directly
9. **Richer AI context** — feed past recommendations, their statuses, individual action item progress, and financial data history into the prompt for more personalized, context-aware recommendations
10. **Iterative product development** — user interviews, competitive analysis, and usage data to prioritize features that drive real engagement
11. **Enable remaining verticals** — Health, Tax, and Legal wallets with vertical-specific score algorithms and AI prompts
