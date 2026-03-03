import type { Tables } from "@/lib/supabase/types";

type User = Tables<"users">;
type FinancialProfile = Tables<"financial_profiles">;
type Goal = Tables<"goals">;
type ScoreSnapshot = Tables<"score_snapshots">;
type Recommendation = Tables<"recommendations">;

export interface DemoClientData {
  user: User;
  profile: FinancialProfile;
  goal: Goal;
  scoreSnapshots: ScoreSnapshot[];
  recommendations: Recommendation[];
}

export interface DemoAdminData {
  advisor: User;
  clients: Array<{
    user: User;
    profile: FinancialProfile;
    goal: Goal;
    latestScore: ScoreSnapshot;
    scoreSnapshots: ScoreSnapshot[];
    recommendations: Recommendation[];
  }>;
}

const DEMO_ADVISOR: User = {
  id: "demo-advisor-001",
  name: "Sarah Mitchell",
  email: "sarah@advisor.demo",
  role: "advisor",
  created_at: "2025-11-01T00:00:00Z",
};

const DEMO_CLIENT_1: User = {
  id: "demo-client-001",
  name: "Alex Chen",
  email: "alex@client.demo",
  role: "client",
  created_at: "2025-12-01T00:00:00Z",
};

const DEMO_CLIENT_2: User = {
  id: "demo-client-002",
  name: "Jordan Rivera",
  email: "jordan@client.demo",
  role: "client",
  created_at: "2026-01-10T00:00:00Z",
};

const DEMO_CLIENT_3: User = {
  id: "demo-client-003",
  name: "Priya Patel",
  email: "priya@client.demo",
  role: "client",
  created_at: "2026-02-05T00:00:00Z",
};

const PROFILE_1: FinancialProfile = {
  id: "demo-profile-001",
  user_id: DEMO_CLIENT_1.id,
  monthly_income: 6500,
  monthly_expenses: 4200,
  total_debt: 18000,
  total_savings: 12000,
  updated_at: "2026-02-28T00:00:00Z",
};

const PROFILE_2: FinancialProfile = {
  id: "demo-profile-002",
  user_id: DEMO_CLIENT_2.id,
  monthly_income: 5000,
  monthly_expenses: 4600,
  total_debt: 32000,
  total_savings: 3200,
  updated_at: "2026-02-20T00:00:00Z",
};

const PROFILE_3: FinancialProfile = {
  id: "demo-profile-003",
  user_id: DEMO_CLIENT_3.id,
  monthly_income: 8200,
  monthly_expenses: 3800,
  total_debt: 5000,
  total_savings: 28000,
  updated_at: "2026-03-01T00:00:00Z",
};

const GOAL_1: Goal = {
  id: "demo-goal-001",
  user_id: DEMO_CLIENT_1.id,
  title: "Build emergency fund",
  target_amount: 15000,
  current_amount: 12000,
  deadline: "2026-12-31",
  created_at: "2026-01-15T00:00:00Z",
  updated_at: "2026-02-28T00:00:00Z",
};

const GOAL_2: Goal = {
  id: "demo-goal-002",
  user_id: DEMO_CLIENT_2.id,
  title: "Pay off credit card debt",
  target_amount: 32000,
  current_amount: 8000,
  deadline: "2027-06-30",
  created_at: "2026-01-20T00:00:00Z",
  updated_at: "2026-02-20T00:00:00Z",
};

const GOAL_3: Goal = {
  id: "demo-goal-003",
  user_id: DEMO_CLIENT_3.id,
  title: "Down payment for house",
  target_amount: 60000,
  current_amount: 28000,
  deadline: "2027-12-31",
  created_at: "2026-02-10T00:00:00Z",
  updated_at: "2026-03-01T00:00:00Z",
};

function makeScoreSnapshots(
  userId: string,
  scores: Array<{ score: number; date: string }>
): ScoreSnapshot[] {
  return scores.map((s, i) => ({
    id: `demo-score-${userId}-${i}`,
    user_id: userId,
    score: s.score,
    breakdown: {
      savings_rate: Math.round(s.score * 0.25),
      debt_ratio: Math.round(s.score * 0.28),
      emergency_coverage: Math.round(s.score * 0.22),
      goal_progress: Math.round(s.score * 0.25),
    },
    created_at: s.date,
  }));
}

const SCORES_1 = makeScoreSnapshots(DEMO_CLIENT_1.id, [
  { score: 45, date: "2025-10-01T00:00:00Z" },
  { score: 50, date: "2025-11-01T00:00:00Z" },
  { score: 55, date: "2025-12-01T00:00:00Z" },
  { score: 60, date: "2026-01-01T00:00:00Z" },
  { score: 67, date: "2026-02-01T00:00:00Z" },
  { score: 72, date: "2026-03-01T00:00:00Z" },
]);

const SCORES_2 = makeScoreSnapshots(DEMO_CLIENT_2.id, [
  { score: 28, date: "2026-01-15T00:00:00Z" },
  { score: 32, date: "2026-02-01T00:00:00Z" },
  { score: 35, date: "2026-03-01T00:00:00Z" },
]);

const SCORES_3 = makeScoreSnapshots(DEMO_CLIENT_3.id, [
  { score: 70, date: "2026-02-10T00:00:00Z" },
  { score: 78, date: "2026-02-20T00:00:00Z" },
  { score: 85, date: "2026-03-01T00:00:00Z" },
]);

const RECS_1: Recommendation[] = [
  {
    id: "demo-rec-001",
    client_id: DEMO_CLIENT_1.id,
    advisor_id: DEMO_ADVISOR.id,
    status: "acknowledged",
    summary:
      "Your savings rate is solid at 35%, but high debt relative to income is dragging your score. Prioritize accelerating debt payoff while maintaining your emergency fund contributions.",
    actions: [
      {
        action: "Allocate an extra $300/month toward debt principal",
        priority: "high",
        rationale:
          "Reducing the $18K debt faster will improve your debt-to-income ratio significantly",
      },
      {
        action: "Set up automatic transfers of $200/month to savings",
        priority: "medium",
        rationale:
          "You're 80% toward your emergency fund goal -- automate to stay consistent",
      },
      {
        action: "Review subscriptions and cut $150/month in discretionary spending",
        priority: "low",
        rationale:
          "Small expense reductions compound and free up capital for debt payoff",
      },
    ],
    ai_generated: true,
    created_at: "2026-02-15T00:00:00Z",
    sent_at: "2026-02-15T10:00:00Z",
    acknowledged_at: "2026-02-16T08:30:00Z",
    completed_at: null,
  },
  {
    id: "demo-rec-002",
    client_id: DEMO_CLIENT_1.id,
    advisor_id: DEMO_ADVISOR.id,
    status: "sent",
    summary:
      "Great progress this month! Score improved to 72. Focus on maintaining momentum with debt reduction and building toward your emergency fund target of $15K.",
    actions: [
      {
        action: "Increase debt payments by $100 now that expenses are lower",
        priority: "high",
        rationale:
          "With $4,200 expenses on $6,500 income, there's room to accelerate payoff",
      },
      {
        action: "Open a high-yield savings account for emergency fund",
        priority: "medium",
        rationale:
          "Your $12K savings should earn 4-5% APY instead of sitting in checking",
      },
      {
        action: "Schedule a goal review for Q2 to reassess targets",
        priority: "low",
        rationale:
          "You may be able to increase your emergency fund target once debt is lower",
      },
    ],
    ai_generated: true,
    created_at: "2026-03-01T00:00:00Z",
    sent_at: "2026-03-01T09:00:00Z",
    acknowledged_at: null,
    completed_at: null,
  },
];

const RECS_2: Recommendation[] = [
  {
    id: "demo-rec-003",
    client_id: DEMO_CLIENT_2.id,
    advisor_id: DEMO_ADVISOR.id,
    status: "draft",
    summary:
      "High debt-to-income ratio and low savings are significant risks. Immediate focus should be on building a basic emergency buffer while aggressively tackling credit card debt.",
    actions: [
      {
        action: "Consolidate credit card debt into a lower-rate personal loan",
        priority: "high",
        rationale:
          "Reducing interest from 22% to ~8% saves approximately $4,500/year",
      },
      {
        action: "Build a $2,000 mini emergency fund within 3 months",
        priority: "high",
        rationale:
          "Current $3,200 savings covers less than 1 month of expenses",
      },
      {
        action: "Reduce monthly expenses by $400 through meal planning and transit",
        priority: "medium",
        rationale:
          "At 92% expense-to-income ratio, there's almost no margin for savings",
      },
    ],
    ai_generated: true,
    created_at: "2026-03-02T00:00:00Z",
    sent_at: null,
    acknowledged_at: null,
    completed_at: null,
  },
];

export const DEMO_CLIENT_DATA: DemoClientData = {
  user: DEMO_CLIENT_1,
  profile: PROFILE_1,
  goal: GOAL_1,
  scoreSnapshots: SCORES_1,
  recommendations: RECS_1,
};

export const DEMO_ADMIN_DATA: DemoAdminData = {
  advisor: DEMO_ADVISOR,
  clients: [
    {
      user: DEMO_CLIENT_1,
      profile: PROFILE_1,
      goal: GOAL_1,
      latestScore: SCORES_1[SCORES_1.length - 1],
      scoreSnapshots: SCORES_1,
      recommendations: RECS_1,
    },
    {
      user: DEMO_CLIENT_2,
      profile: PROFILE_2,
      goal: GOAL_2,
      latestScore: SCORES_2[SCORES_2.length - 1],
      scoreSnapshots: SCORES_2,
      recommendations: RECS_2,
    },
    {
      user: DEMO_CLIENT_3,
      profile: PROFILE_3,
      goal: GOAL_3,
      latestScore: SCORES_3[SCORES_3.length - 1],
      scoreSnapshots: SCORES_3,
      recommendations: [],
    },
  ],
};
