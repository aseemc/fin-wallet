"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MetricCard } from "@/components/metric-card";
import { ScoreRing } from "@/components/score-ring";
import { ScoreChart } from "@/components/score-chart";
import { RecommendationCard } from "@/components/recommendation-card";
import { RecommendSheet } from "./recommend-sheet";
import { DEMO_ADMIN_DATA } from "@/lib/demo-data";
import { getScoreColor, getScoreLabel } from "@/lib/score";
import { DollarSign, TrendingDown, Landmark, PiggyBank, ArrowLeft, Pencil, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Tables } from "@/lib/supabase/types";

function formatCurrency(n: number | null | undefined): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n ?? 0);
}

interface Props {
  isDemoMode: boolean;
  clientId: string;
  client?: Tables<"users"> | null;
  profile?: Tables<"financial_profiles"> | null;
  goal?: Tables<"goals"> | null;
  snapshots?: Tables<"score_snapshots">[];
  recommendations?: Tables<"recommendations">[];
}

export function ClientDetailContent({
  isDemoMode,
  clientId,
  client: realClient,
  profile: realProfile,
  goal: realGoal,
  snapshots: realSnapshots,
  recommendations: realRecs,
}: Props) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [viewingRec, setViewingRec] = useState<Tables<"recommendations"> | null>(null);

  const demoClient = isDemoMode
    ? DEMO_ADMIN_DATA.clients.find((c) => c.user.id === clientId)
    : null;

  if (isDemoMode && !demoClient) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Client not found in demo data.</p>
        <Link href="/admin" className="text-sm text-primary underline mt-2 inline-block">
          ← Back to clients
        </Link>
      </div>
    );
  }

  const client = isDemoMode ? demoClient!.user : realClient;
  const profile = isDemoMode ? demoClient!.profile : realProfile;
  const goal = isDemoMode ? demoClient!.goal : realGoal;
  const snapshots = isDemoMode ? demoClient!.scoreSnapshots : (realSnapshots ?? []);
  const recommendations = isDemoMode ? demoClient!.recommendations : (realRecs ?? []);

  const latestScore = snapshots.length > 0 ? snapshots[snapshots.length - 1] : null;
  const score = latestScore?.score ?? 0;
  const breakdown = latestScore?.breakdown as Record<string, number> | null;
  const hasProfile = profile && (profile.monthly_income ?? 0) > 0;

  const draft = recommendations.find((r) => r.status === "draft") ?? null;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/admin">
          <Button variant="ghost" size="icon" className="shrink-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{client?.name}</h1>
            {latestScore && (
              <Badge
                variant="secondary"
                className={getScoreColor(score)}
              >
                Score: {score} · {getScoreLabel(score)}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{client?.email}</p>
        </div>
        <Button onClick={() => setSheetOpen(true)}>
          Generate Recommendations
        </Button>
      </div>

      {!hasProfile ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              This client hasn&apos;t entered financial data yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 flex flex-col items-center justify-center">
              <ScoreRing score={score} size={140} />
            </div>
            <div className="lg:col-span-2 grid grid-cols-2 gap-3">
              <MetricCard
                label="Monthly Income"
                value={formatCurrency(profile.monthly_income)}
                icon={<DollarSign className="h-5 w-5 text-emerald-500" />}
              />
              <MetricCard
                label="Monthly Expenses"
                value={formatCurrency(profile.monthly_expenses)}
                icon={<TrendingDown className="h-5 w-5 text-red-500" />}
              />
              <MetricCard
                label="Total Debt"
                value={formatCurrency(profile.total_debt)}
                icon={<Landmark className="h-5 w-5 text-amber-500" />}
              />
              <MetricCard
                label="Total Savings"
                value={formatCurrency(profile.total_savings)}
                icon={<PiggyBank className="h-5 w-5 text-blue-500" />}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {breakdown && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Score Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <BreakdownRow label="Savings Rate" value={breakdown.savings_rate} max={25} />
                  <BreakdownRow label="Debt-to-Income" value={breakdown.debt_ratio} max={25} />
                  <BreakdownRow label="Emergency Fund" value={breakdown.emergency_coverage} max={25} />
                  <BreakdownRow label="Goal Progress" value={breakdown.goal_progress} max={25} />
                </CardContent>
              </Card>
            )}

            {snapshots.length > 1 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Score Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScoreChart snapshots={snapshots} />
                </CardContent>
              </Card>
            )}
          </div>

          {goal && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Goal Progress
                </CardTitle>
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
        </>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recommendation History</h2>
          <span className="text-sm text-muted-foreground">
            {recommendations.length} recommendation{recommendations.length !== 1 ? "s" : ""}
          </span>
        </div>

        {recommendations.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                No recommendations yet. Generate AI-powered recommendations for this client.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[120px]">Status</TableHead>
                  <TableHead className="w-[120px]">Last Sent</TableHead>
                  <TableHead className="w-[100px] text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recommendations.map((rec) => (
                  <TableRow key={rec.id}>
                    <TableCell>
                      <p className="text-sm whitespace-normal">{rec.summary}</p>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={rec.status} />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {rec.sent_at
                        ? new Date(rec.sent_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      {rec.status === "draft" ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSheetOpen(true)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setViewingRec(rec)}
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>

      <Dialog
        open={!!viewingRec}
        onOpenChange={(open) => !open && setViewingRec(null)}
      >
        <DialogContent className="w-[50vw] sm:max-w-none max-h-[85vh] overflow-y-auto">
          {viewingRec && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  Recommendation
                  <StatusBadge status={viewingRec.status} />
                </DialogTitle>
              </DialogHeader>
              <RecommendationCard
                summary={viewingRec.summary}
                actions={
                  viewingRec.actions as {
                    action: string;
                    priority: "high" | "medium" | "low";
                    rationale: string;
                  }[]
                }
                status={viewingRec.status}
                createdAt={viewingRec.created_at}
                sentAt={viewingRec.sent_at}
                acknowledgedAt={viewingRec.acknowledged_at}
                startedAt={viewingRec.started_at}
                completedAt={viewingRec.completed_at}
                aiGenerated={viewingRec.ai_generated}
                hideBadge
              />
            </>
          )}
        </DialogContent>
      </Dialog>

      <RecommendSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        isDemoMode={isDemoMode}
        clientId={clientId}
        clientName={client?.name}
        score={score}
        hasProfile={!!hasProfile}
        draft={draft}
      />
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

const STATUS_CONFIG: Record<
  string,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive"; className?: string }
> = {
  draft: { label: "Draft", variant: "outline", className: "border-muted-foreground/40" },
  sent: { label: "Sent", variant: "default", className: "bg-blue-500 hover:bg-blue-500" },
  acknowledged: { label: "Acknowledged", variant: "default", className: "bg-amber-500 hover:bg-amber-500" },
  in_progress: { label: "In Progress", variant: "default", className: "bg-indigo-500 hover:bg-indigo-500" },
  completed: { label: "Completed", variant: "default", className: "bg-emerald-500 hover:bg-emerald-500" },
};

function StatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.draft;
  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
}
