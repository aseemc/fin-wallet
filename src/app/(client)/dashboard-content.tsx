"use client";

import { ScoreRing } from "@/components/score-ring";
import { ScoreChart } from "@/components/score-chart";
import { MetricCard } from "@/components/metric-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DEMO_CLIENT_DATA } from "@/lib/demo-data";
import { DollarSign, TrendingDown, Landmark, PiggyBank } from "lucide-react";
import Link from "next/link";
import type { Tables } from "@/lib/supabase/types";

function formatCurrency(n: number | null | undefined): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n ?? 0);
}

interface DashboardProps {
  isDemoMode: boolean;
  userName?: string;
  profile?: Tables<"financial_profiles"> | null;
  goal?: Tables<"goals"> | null;
  snapshots?: Tables<"score_snapshots">[];
}

export function ClientDashboardContent({
  isDemoMode,
  userName,
  profile: realProfile,
  goal: realGoal,
  snapshots: realSnapshots,
}: DashboardProps) {
  const profile = isDemoMode ? DEMO_CLIENT_DATA.profile : realProfile;
  const goal = isDemoMode ? DEMO_CLIENT_DATA.goal : realGoal;
  const snapshots = isDemoMode ? DEMO_CLIENT_DATA.scoreSnapshots : (realSnapshots ?? []);
  const name = isDemoMode ? DEMO_CLIENT_DATA.user.name : userName;

  const latestScore = snapshots.length > 0 ? snapshots[snapshots.length - 1] : null;
  const score = latestScore?.score ?? 0;
  const hasProfile = profile && (profile.monthly_income ?? 0) > 0;

  return (
    <div className="space-y-6 p-4 pb-8">
      <div>
        <h1 className="text-2xl font-bold">Financial Health</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back, {name ?? "there"}
        </p>
      </div>

      {!hasProfile && !isDemoMode ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              Get started by entering your financial data.
            </p>
            <Link
              href="/data"
              className="mt-3 inline-block text-sm font-medium text-primary underline underline-offset-4"
            >
              Enter your finances →
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex justify-center">
            <ScoreRing score={score} />
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Score Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ScoreChart snapshots={snapshots} />
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            <MetricCard
              label="Income"
              value={formatCurrency(profile?.monthly_income)}
              icon={<DollarSign className="h-5 w-5 text-emerald-500" />}
            />
            <MetricCard
              label="Expenses"
              value={formatCurrency(profile?.monthly_expenses)}
              icon={<TrendingDown className="h-5 w-5 text-red-500" />}
            />
            <MetricCard
              label="Total Debt"
              value={formatCurrency(profile?.total_debt)}
              icon={<Landmark className="h-5 w-5 text-amber-500" />}
            />
            <MetricCard
              label="Savings"
              value={formatCurrency(profile?.total_savings)}
              icon={<PiggyBank className="h-5 w-5 text-blue-500" />}
            />
          </div>

          {goal && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Goal Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="font-medium">{goal.title}</span>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(
                      ((goal.current_amount ?? 0) / goal.target_amount) * 100
                    )}
                    %
                  </span>
                </div>
                <Progress
                  value={Math.min(
                    100,
                    ((goal.current_amount ?? 0) / goal.target_amount) * 100
                  )}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatCurrency(goal.current_amount)}</span>
                  <span>{formatCurrency(goal.target_amount)}</span>
                </div>
                {goal.deadline && (
                  <p className="text-xs text-muted-foreground">
                    Deadline:{" "}
                    {new Date(goal.deadline).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {latestScore && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Score Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <BreakdownRow
                  label="Savings Rate"
                  value={(latestScore.breakdown as Record<string, number>).savings_rate}
                  max={25}
                />
                <BreakdownRow
                  label="Debt-to-Income"
                  value={(latestScore.breakdown as Record<string, number>).debt_ratio}
                  max={25}
                />
                <BreakdownRow
                  label="Emergency Fund"
                  value={(latestScore.breakdown as Record<string, number>).emergency_coverage}
                  max={25}
                />
                <BreakdownRow
                  label="Goal Progress"
                  value={(latestScore.breakdown as Record<string, number>).goal_progress}
                  max={25}
                />
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

function BreakdownRow({
  label,
  value,
  max,
}: {
  label: string;
  value: number;
  max: number;
}) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="font-medium tabular-nums">
          {value}/{max}
        </span>
      </div>
      <Progress value={(value / max) * 100} className="h-1.5" />
    </div>
  );
}
