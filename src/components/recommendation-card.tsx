import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Action {
  action: string;
  priority: "high" | "medium" | "low";
  rationale: string;
}

interface RecommendationCardProps {
  summary: string;
  actions: Action[];
  status: string;
  createdAt: string | null;
  sentAt: string | null;
  acknowledgedAt: string | null;
  completedAt: string | null;
  aiGenerated?: boolean | null;
  compact?: boolean;
  hideBadge?: boolean;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive"; className?: string }
> = {
  draft: { label: "Draft", variant: "outline", className: "border-muted-foreground/40" },
  sent: { label: "Sent", variant: "default", className: "bg-blue-500 hover:bg-blue-500" },
  acknowledged: { label: "Acknowledged", variant: "default", className: "bg-amber-500 hover:bg-amber-500" },
  done: { label: "Completed", variant: "default", className: "bg-emerald-500 hover:bg-emerald-500" },
};

const PRIORITY_COLORS: Record<string, string> = {
  high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  low: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
};

function formatDate(date: string | null): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function RecommendationCard({
  summary,
  actions,
  status,
  createdAt,
  sentAt,
  acknowledgedAt,
  completedAt,
  aiGenerated,
  compact,
  hideBadge,
}: RecommendationCardProps) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.draft;
  const typedActions = actions as Action[];

  return (
    <Card className={cn(compact && "shadow-sm")}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm font-medium leading-snug">
            {summary}
          </CardTitle>
          {!hideBadge && (
            <Badge
              variant={config.variant}
              className={cn("shrink-0", config.className)}
            >
              {config.label}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {aiGenerated && (
            <span className="inline-flex items-center gap-1">
              <SparklesIcon /> AI-generated
            </span>
          )}
          {createdAt && <span>{formatDate(createdAt)}</span>}
        </div>
      </CardHeader>
      {!compact && typedActions.length > 0 && (
        <CardContent className="space-y-2 pt-0">
          {typedActions.map((item, i) => (
            <div
              key={i}
              className="rounded-md border p-3 space-y-1"
            >
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
              <p className="text-xs text-muted-foreground pl-1">
                {item.rationale}
              </p>
            </div>
          ))}
          <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-xs text-muted-foreground">
            {sentAt && <span>Sent {formatDate(sentAt)}</span>}
            {acknowledgedAt && <span>Acknowledged {formatDate(acknowledgedAt)}</span>}
            {completedAt && <span>Completed {formatDate(completedAt)}</span>}
          </div>
        </CardContent>
      )}
    </Card>
  );
}

function SparklesIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
      <path d="M20 3v4" />
      <path d="M22 5h-4" />
      <path d="M4 17v2" />
      <path d="M5 18H3" />
    </svg>
  );
}
