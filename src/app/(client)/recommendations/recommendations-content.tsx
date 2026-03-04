"use client";

import { useState, useTransition, useOptimistic } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useDemoMode } from "@/providers/demo-provider";
import { DEMO_CLIENT_DATA } from "@/lib/demo-data";
import {
  acknowledgeRecommendation,
  startRecommendation,
  completeRecommendation,
} from "@/actions/recommendations";
import {
  CheckCircle2,
  ThumbsUp,
  Play,
  Loader2,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Tables } from "@/lib/supabase/types";

type Recommendation = Tables<"recommendations">;

interface ActionItem {
  action: string;
  priority: "high" | "medium" | "low";
  rationale: string;
}

interface Props {
  isDemoMode: boolean;
  recommendations: Recommendation[];
}

const CLIENT_STATUS_CONFIG: Record<
  string,
  { label: string; className: string }
> = {
  sent: { label: "Pending", className: "bg-blue-500 hover:bg-blue-500 text-white" },
  acknowledged: { label: "Acknowledged", className: "bg-amber-500 hover:bg-amber-500 text-white" },
  in_progress: { label: "In Progress", className: "bg-indigo-500 hover:bg-indigo-500 text-white" },
  completed: { label: "Completed", className: "bg-emerald-500 hover:bg-emerald-500 text-white" },
};

const PRIORITY_COLORS: Record<string, string> = {
  high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  low: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
};

function formatDate(date: string | null): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function RecommendationsContent({
  isDemoMode: serverDemoMode,
  recommendations: serverRecs,
}: Props) {
  const { isDemoMode: clientDemoMode } = useDemoMode();
  const isDemoMode = serverDemoMode || clientDemoMode;

  const sourceRecs = isDemoMode
    ? DEMO_CLIENT_DATA.recommendations.filter((r) => r.status !== "draft")
    : serverRecs;

  const [optimisticRecs, updateOptimistic] = useOptimistic(
    sourceRecs,
    (
      state: Recommendation[],
      update: { id: string; status: string; timestamp: string }
    ) =>
      state.map((r) => {
        if (r.id !== update.id) return r;
        const ts = update.timestamp;
        return {
          ...r,
          status: update.status,
          ...(update.status === "acknowledged" && { acknowledged_at: ts }),
          ...(update.status === "in_progress" && { started_at: ts }),
          ...(update.status === "completed" && { completed_at: ts }),
        };
      })
  );

  const [isPending, startTransition] = useTransition();
  const [selected, setSelected] = useState<Recommendation | null>(null);

  function handleAction(id: string, nextStatus: string) {
    if (isDemoMode) {
      toast.info("Demo mode — view only");
      return;
    }

    const actionFn =
      nextStatus === "acknowledged"
        ? acknowledgeRecommendation
        : nextStatus === "in_progress"
          ? startRecommendation
          : completeRecommendation;

    const successMsg =
      nextStatus === "acknowledged"
        ? "Recommendation acknowledged"
        : nextStatus === "in_progress"
          ? "Recommendation started"
          : "Recommendation marked as complete";

    startTransition(async () => {
      updateOptimistic({ id, status: nextStatus, timestamp: new Date().toISOString() });
      const result = await actionFn(id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(successMsg);
        if (nextStatus !== "acknowledged") {
          setSelected(null);
        }
      }
    });
  }

  const currentSelected = selected
    ? optimisticRecs.find((r) => r.id === selected.id) ?? selected
    : null;

  if (optimisticRecs.length === 0) {
    return (
      <div className="px-4 py-12 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <MessageSquare className="h-6 w-6 text-muted-foreground" />
        </div>
        <h2 className="text-lg font-semibold">No recommendations yet</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Your advisor hasn&apos;t sent any recommendations. Check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 space-y-4">
      <div>
        <h1 className="text-xl font-bold">Advisor Recommendations</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {optimisticRecs.length} recommendation{optimisticRecs.length !== 1 ? "s" : ""} from your advisor
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead className="w-[110px] text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {optimisticRecs.map((rec) => {
            const statusCfg = CLIENT_STATUS_CONFIG[rec.status] ?? CLIENT_STATUS_CONFIG.sent;
            return (
              <TableRow
                key={rec.id}
                className="cursor-pointer"
                onClick={() => setSelected(rec)}
              >
                <TableCell>
                  <p className="line-clamp-2 text-sm font-medium whitespace-normal">{rec.client_summary ?? rec.summary}</p>
                </TableCell>
                <TableCell className="text-right">
                  <Badge className={cn("text-xs", statusCfg.className)}>
                    {statusCfg.label}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <Dialog open={!!currentSelected} onOpenChange={(open) => !open && setSelected(null)}>
        {currentSelected && (
          <RecommendationModal
            rec={currentSelected}
            isPending={isPending}
            onAction={handleAction}
          />
        )}
      </Dialog>
    </div>
  );
}

function RecommendationModal({
  rec,
  isPending,
  onAction,
}: {
  rec: Recommendation;
  isPending: boolean;
  onAction: (id: string, nextStatus: string) => void;
}) {
  const statusCfg = CLIENT_STATUS_CONFIG[rec.status] ?? CLIENT_STATUS_CONFIG.sent;
  const actions = (rec.actions ?? []) as unknown as ActionItem[];

  return (
    <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto">
      <DialogHeader>
        <div className="flex items-center gap-2">
          <DialogTitle className="text-base leading-snug flex-1">
            Recommendation Details
          </DialogTitle>
          <Badge className={cn("shrink-0 text-xs", statusCfg.className)}>
            {statusCfg.label}
          </Badge>
        </div>
        <DialogDescription className="text-left">
          Received {formatDate(rec.sent_at)}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-semibold mb-1">Summary</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{rec.client_summary ?? rec.summary}</p>
        </div>

        {actions.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Action Items</h4>
            {actions.map((item, i) => (
              <div key={i} className="rounded-md border p-3 space-y-1">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-[10px] font-medium uppercase",
                      PRIORITY_COLORS[item.priority]
                    )}
                  >
                    {item.priority}
                  </Badge>
                  <span className="text-sm font-medium">{item.action}</span>
                </div>
                <p className="text-xs text-muted-foreground pl-1">{item.rationale}</p>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-4 gap-2 border-t pt-3 text-center">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Received</p>
            <p className="text-xs font-medium">{formatDate(rec.sent_at)}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Acknowledged</p>
            <p className="text-xs font-medium">{formatDate(rec.acknowledged_at)}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Started</p>
            <p className="text-xs font-medium">{formatDate(rec.started_at)}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Completed</p>
            <p className="text-xs font-medium">{formatDate(rec.completed_at)}</p>
          </div>
        </div>
      </div>

      {rec.status !== "completed" && (
        <DialogFooter>
          {rec.status === "sent" && (
            <Button onClick={() => onAction(rec.id, "acknowledged")} disabled={isPending}>
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ThumbsUp className="h-4 w-4" />}
              Acknowledge
            </Button>
          )}
          {rec.status === "acknowledged" && (
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={() => onAction(rec.id, "in_progress")}
              disabled={isPending}
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              Start
            </Button>
          )}
          {rec.status === "in_progress" && (
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => onAction(rec.id, "completed")}
              disabled={isPending}
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              Mark Complete
            </Button>
          )}
        </DialogFooter>
      )}
    </DialogContent>
  );
}

