# AI Usage Note

## AI in the Product

### Feature
Advisors can generate AI-powered financial risk assessments with one click. The system produces:
- A **clinical risk summary** for the advisor (data-driven, concise)
- An **encouraging client message** (warm, motivational, jargon-free)
- **3 prioritized action items** with rationale

### Model
`gpt-4o-mini` via the OpenAI API.

### Flow
1. Advisor clicks "Generate AI Recommendations" on a client's detail page
2. Client's financial data (income, expenses, debt, savings), score breakdown, and goal progress are assembled into a structured prompt
3. The model responds in JSON mode with both summaries and action items
4. Response is validated against a Zod schema (`recommendationSchema` in `src/lib/ai.ts`)
5. Advisor reviews and edits both the risk summary and client message in an editable form
6. Advisor saves as draft, then sends to client
7. Client only ever sees the `client_summary` (warm, encouraging language) — never the clinical risk assessment

### Dual Summary Design
The AI generates two distinct perspectives in a single call:
- `summary` — clinical, data-driven, references specific ratios and dollar amounts; intended for the advisor's internal use
- `client_summary` — warm, encouraging, focuses on progress and next steps; this is what the client sees

This separation ensures the client receives motivational guidance while the advisor retains full analytical context.

### Guardrails
- **JSON mode** — `response_format: { type: "json_object" }` ensures parseable output
- **Zod validation** — schema enforces exactly 3 actions with required fields, string summaries
- **Low temperature** (0.3) — consistent, predictable recommendations
- **Advisor review gate** — AI output is always editable; advisor must explicitly save and send
- **No PII beyond financial figures** — prompt contains only aggregated financial data, no names or identifiers
- **Error handling** — if AI call fails, advisor sees an error toast and can write recommendations manually

### Value
Reduces advisor time-to-first-recommendation from manual analysis to a single click, while maintaining full human oversight. The dual-summary architecture ensures communication is appropriate for each audience.

## AI in Development

- Used Cursor IDE with Claude for: architecture planning, boilerplate scaffolding, component generation, prompt engineering, and debugging
- All generated code was reviewed, understood, and adapted to project conventions before inclusion
- AI assisted with: Supabase schema design, middleware auth logic, demo mode architecture, score computation, and documentation drafting
