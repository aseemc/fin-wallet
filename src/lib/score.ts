export interface ScoreInput {
  monthlyIncome: number;
  monthlyExpenses: number;
  totalDebt: number;
  totalSavings: number;
  goalTarget: number;
  goalCurrent: number;
}

export interface ScoreBreakdown {
  savings_rate: number;
  debt_ratio: number;
  emergency_coverage: number;
  goal_progress: number;
}

export interface ScoreResult {
  score: number;
  breakdown: ScoreBreakdown;
}

export function computeScore(input: ScoreInput): ScoreResult {
  const { monthlyIncome, monthlyExpenses, totalDebt, totalSavings, goalTarget, goalCurrent } = input;

  const savingsRate =
    monthlyIncome > 0
      ? Math.min(25, ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 50)
      : 0;

  const debtRatio =
    monthlyIncome > 0
      ? Math.max(0, 25 * (1 - Math.min(totalDebt / (monthlyIncome * 12), 1)))
      : totalDebt > 0
        ? 0
        : 25;

  const emergencyCoverage =
    monthlyExpenses > 0
      ? Math.min(25, (totalSavings / monthlyExpenses / 6) * 25)
      : totalSavings > 0
        ? 25
        : 0;

  const goalProgress =
    goalTarget > 0
      ? Math.min(25, (goalCurrent / goalTarget) * 25)
      : 0;

  const breakdown: ScoreBreakdown = {
    savings_rate: Math.round(Math.max(0, savingsRate)),
    debt_ratio: Math.round(Math.max(0, debtRatio)),
    emergency_coverage: Math.round(Math.max(0, emergencyCoverage)),
    goal_progress: Math.round(Math.max(0, goalProgress)),
  };

  const score = breakdown.savings_rate + breakdown.debt_ratio + breakdown.emergency_coverage + breakdown.goal_progress;

  return { score: Math.min(100, Math.max(0, score)), breakdown };
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "text-emerald-500";
  if (score >= 60) return "text-blue-500";
  if (score >= 40) return "text-amber-500";
  return "text-red-500";
}

export function getScoreLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";
  return "Needs Work";
}

export function getScoreBgColor(score: number): string {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 60) return "bg-blue-500";
  if (score >= 40) return "bg-amber-500";
  return "bg-red-500";
}

export function getScoreStrokeColor(score: number): string {
  if (score >= 80) return "#10b981";
  if (score >= 60) return "#3b82f6";
  if (score >= 40) return "#f59e0b";
  return "#ef4444";
}
