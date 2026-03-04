# Product Note: Financial Health Score Wallet

## Who It's For

- **Clients**: Young professionals who want a simple, actionable view of their financial health without spreadsheet complexity. They need motivation, not just data.
- **Advisors**: Financial planners who need efficient tools to review client data and deliver personalized guidance at scale, without spending 30 minutes drafting each recommendation.

## Core Loop

1. **Client signs up** and enters financial data (income, expenses, debts, savings)
2. **System computes a Financial Health Score** (0–100) with a transparent 4-component breakdown
3. **Client sets a goal** (e.g., "Build $15K emergency fund by Dec 2026")
4. **Advisor reviews** the client's financial snapshot and score drivers
5. **Advisor generates AI-assisted recommendations**, edits for context, and sends
6. **Client receives encouraging guidance** — acknowledges, starts, and marks complete
7. **Score updates** as the financial picture improves — closing the motivation loop

## Why a Score?

Scores create motivation loops. A single number is glanceable, trackable, and shareable. The 4-component breakdown makes it actionable — clients can see exactly which area to focus on. The trend chart makes progress visible over time, turning abstract financial health into a concrete trajectory.

## The AI Moment

The AI integration isn't decorative — it solves a real bottleneck. Writing personalized, data-informed recommendations is the most time-consuming part of financial advising. The system generates both a clinical risk assessment (for the advisor's context) and a warm, encouraging message (for the client's motivation) in a single call. The advisor retains full editorial control, ensuring AI augments rather than replaces professional judgment.

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Dual summaries** (advisor + client) | Different audiences need different tones; clinical language demotivates clients |
| **Score on write** | Compute and store snapshots when data changes; enables trend tracking without background jobs |
| **Cookie-based demo mode** | Evaluators can explore the full product without signup; respects their time |
| **3-step recommendation flow** | Acknowledge → Start → Complete mirrors real behavior change; gives advisors visibility into engagement |
| **Mobile-first client, desktop-first advisor** | Clients check finances on their phone; advisors work at their desk |

## Scope Decisions

### What I built
- Complete auth flow (signup/login for both roles)
- Full financial data entry → score computation → trend tracking pipeline
- Goal setting with progress visualization
- AI recommendation generation with dual summaries and editable action items
- Client recommendation actions with optimistic UI
- Demo mode for both client and advisor views
- Light/dark mode

### What I intentionally cut
- **Row-Level Security**: Auth is enforced at the middleware/server-action level. Table structure supports RLS for when it's needed.
- **Multi-goal support**: One goal keeps the MVP focused; the schema supports multiple goals already.
- **Real-time updates**: Polling via `revalidatePath` is sufficient for MVP; WebSockets are a scaling concern.
- **Tests**: Prioritized shipping a complete, polished flow over test coverage. Would add Jest + RTL for critical paths next.

## What I'd Add Next

1. **Enable RLS policies** — the table structure is ready; this is the highest-leverage security improvement
2. **Goal templates** — pre-built goals with income-based recommended targets ("Save 3 months of expenses")
3. **Advisor-client assignment** — multi-advisor model with proper access control
4. **Client-initiated check-ins** — let clients request an advisor review when their situation changes
5. **Score history export** — CSV/PDF export for tax preparers or other financial professionals
