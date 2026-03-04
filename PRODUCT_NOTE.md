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

## What I'd Cut (and Why)

- **Row-Level Security**: Auth is enforced at the middleware/server-action level. Table structure supports RLS for when it's needed.
- **Multi-goal support**: One goal keeps the MVP focused; the schema supports multiple goals already.
- **Real-time updates**: Polling via `revalidatePath` is sufficient for MVP; WebSockets are a scaling concern.
- **Tests**: Prioritized shipping a complete, polished flow over test coverage. Would add Jest + RTL for critical paths next.
- **Error tracking & analytics**: No Sentry, no usage analytics. Would add both to inform iteration.
- **Richer AI context**: Past scores, completed recommendations, and goal progress would make generated advice more personalized over time.

## What I'd Add Next

1. **Goal templates** — pre-built goals with income-based recommended targets ("Save 3 months of expenses")
2. **Push notifications** — alert clients when new recommendations arrive, closing the engagement loop
3. **Advisor-client assignment** — multi-advisor model so advisors only see their assigned clients
4. **Client-initiated check-ins** — let clients request an advisor review when their situation changes
