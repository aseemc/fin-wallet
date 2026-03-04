import OpenAI from "openai";
import { z } from "zod";

const actionSchema = z.object({
  action: z.string(),
  priority: z.enum(["high", "medium", "low"]),
  rationale: z.string(),
});

export const recommendationSchema = z.object({
  summary: z.string(),
  client_summary: z.string(),
  actions: z.array(actionSchema).length(3),
});

export type AIRecommendation = z.infer<typeof recommendationSchema>;

interface GenerateInput {
  income: number;
  expenses: number;
  debt: number;
  savings: number;
  score: number;
  breakdown: {
    savings_rate: number;
    debt_ratio: number;
    emergency_coverage: number;
    goal_progress: number;
  };
  goalTitle: string;
  goalTarget: number;
  goalCurrent: number;
}

export async function generateAIRecommendation(
  input: GenerateInput
): Promise<AIRecommendation> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY is not configured. Set it in .env.local to enable AI recommendations."
    );
  }

  const client = new OpenAI({ apiKey });

  const progress =
    input.goalTarget > 0
      ? Math.round((input.goalCurrent / input.goalTarget) * 100)
      : 0;

  const prompt = `You are a financial advisor assistant. Analyze the client's financial data and provide a risk assessment with actionable recommendations.

Client Financial Data:
- Monthly Income: $${input.income.toLocaleString()}
- Monthly Expenses: $${input.expenses.toLocaleString()}
- Total Debt: $${input.debt.toLocaleString()}
- Total Savings: $${input.savings.toLocaleString()}
- Financial Health Score: ${input.score}/100
- Goal: "${input.goalTitle || "No goal set"}" – target $${input.goalTarget.toLocaleString()}, current $${input.goalCurrent.toLocaleString()} (${progress}% complete)

Score Breakdown:
- Savings Rate: ${input.breakdown.savings_rate}/25
- Debt-to-Income Ratio: ${input.breakdown.debt_ratio}/25
- Emergency Fund Coverage: ${input.breakdown.emergency_coverage}/25
- Goal Progress: ${input.breakdown.goal_progress}/25

Respond in JSON: { "summary": "2-3 sentence risk assessment for the advisor (clinical, data-driven)", "client_summary": "2-3 sentence encouraging message for the client (warm, motivational, actionable)", "actions": [{"action": "...", "priority": "high|medium|low", "rationale": "..."}] }
Rules: exactly 3 actions, high priority first, specific dollar amounts, focus on weakest score areas, summary under 280 chars. client_summary should be warm and encouraging, avoid jargon, focus on progress and next steps, under 280 chars.`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.3,
    response_format: { type: "json_object" },
    messages: [{ role: "user", content: prompt }],
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response from AI model");
  }

  const parsed = JSON.parse(content);
  return recommendationSchema.parse(parsed);
}
