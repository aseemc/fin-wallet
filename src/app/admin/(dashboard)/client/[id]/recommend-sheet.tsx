"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useDemoMode } from "@/providers/demo-provider";
import { DEMO_ADMIN_DATA } from "@/lib/demo-data";
import {
  generateRecommendation,
  saveRecommendation,
  sendRecommendation,
  deleteDraftRecommendation,
} from "@/actions/recommendations";
import { Sparkles, Save, Send, Loader2, Trash2, Info } from "lucide-react";

interface ActionItem {
  action: string;
  priority: "high" | "medium" | "low";
  rationale: string;
}

interface DraftRec {
  id: string;
  summary: string;
  client_summary?: string | null;
  actions: unknown;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isDemoMode: boolean;
  clientId: string;
  clientName?: string;
  score?: number | null;
  hasProfile?: boolean;
  draft?: DraftRec | null;
  hasPendingRecommendation?: boolean;
}

const EMPTY_ACTIONS: ActionItem[] = [
  { action: "", priority: "high", rationale: "" },
  { action: "", priority: "medium", rationale: "" },
  { action: "", priority: "low", rationale: "" },
];

function parseDraftActions(raw: unknown): ActionItem[] {
  if (!Array.isArray(raw)) return EMPTY_ACTIONS;
  const parsed = raw.slice(0, 3).map((a: Record<string, string>) => ({
    action: a.action ?? "",
    priority: (["high", "medium", "low"].includes(a.priority) ? a.priority : "medium") as ActionItem["priority"],
    rationale: a.rationale ?? "",
  }));
  return parsed.length >= 3
    ? parsed
    : [...parsed, ...EMPTY_ACTIONS.slice(parsed.length)];
}

export function RecommendSheet({
  open,
  onOpenChange,
  isDemoMode: serverDemoMode,
  clientId,
  clientName: realClientName,
  score: realScore,
  hasProfile: realHasProfile,
  draft,
  hasPendingRecommendation,
}: Props) {
  const { isDemoMode: clientDemoMode } = useDemoMode();
  const isDemoMode = serverDemoMode || clientDemoMode;

  const demoClient = isDemoMode
    ? DEMO_ADMIN_DATA.clients.find((c) => c.user.id === clientId)
    : null;

  const clientName = isDemoMode ? demoClient?.user.name : realClientName;
  const score = isDemoMode
    ? demoClient?.latestScore.score ?? null
    : realScore ?? null;
  const hasProfile = isDemoMode
    ? !!(demoClient?.profile.monthly_income)
    : realHasProfile ?? false;

  const demoDraft = isDemoMode
    ? demoClient?.recommendations.find((r) => r.status === "draft")
    : null;
  const initialDraft = isDemoMode ? demoDraft : draft;

  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [summary, setSummary] = useState(initialDraft?.summary ?? "");
  const [clientSummary, setClientSummary] = useState(initialDraft?.client_summary ?? "");
  const [actions, setActions] = useState<ActionItem[]>(
    initialDraft ? parseDraftActions(initialDraft.actions) : EMPTY_ACTIONS
  );
  const [hasGenerated, setHasGenerated] = useState(!!initialDraft);
  const [savedId, setSavedId] = useState<string | null>(
    initialDraft?.id ?? null
  );
  const [isSaving, startSaveTransition] = useTransition();
  const [isSending, startSendTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();

  function updateAction(
    index: number,
    field: keyof ActionItem,
    value: string
  ) {
    setActions((prev) =>
      prev.map((a, i) =>
        i === index ? { ...a, [field]: value } : a
      )
    );
  }

  async function handleGenerate() {
    if (isDemoMode) {
      setIsGenerating(true);
      await new Promise((r) => setTimeout(r, 1500));

      const demoRec = demoClient?.recommendations.find(
        (r) => r.status === "draft"
      ) ?? demoClient?.recommendations[0];

      if (demoRec) {
        setSummary(demoRec.summary);
        setClientSummary(demoRec.client_summary ?? "");
        const demoActions = demoRec.actions as unknown as ActionItem[];
        setActions(
          demoActions.length >= 3 ? demoActions.slice(0, 3) : [
            ...demoActions,
            ...EMPTY_ACTIONS.slice(demoActions.length),
          ]
        );
      }

      setHasGenerated(true);
      setIsGenerating(false);
      toast.success("Demo: AI recommendation generated");
      return;
    }

    setIsGenerating(true);
    const result = await generateRecommendation(clientId);
    setIsGenerating(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    if (result.data) {
      setSummary(result.data.summary);
      setClientSummary(result.data.client_summary);
      setActions(result.data.actions);
      setHasGenerated(true);
      toast.success("AI recommendation generated");
    }
  }

  function handleSave() {
    if (isDemoMode) {
      toast.info("Demo mode — view only");
      return;
    }

    if (!summary.trim()) {
      toast.error("Summary is required");
      return;
    }

    startSaveTransition(async () => {
      const result = await saveRecommendation(clientId, {
        summary,
        client_summary: clientSummary,
        actions,
      });

      if (result.error) {
        toast.error(result.error);
        return;
      }

      if (result.data) {
        setSavedId(result.data.id);
        toast.success("Recommendation saved as draft");
      }
    });
  }

  function handleSend() {
    if (isDemoMode) {
      toast.info("Demo mode — view only");
      return;
    }

    if (!savedId) {
      toast.error("Save the recommendation first");
      return;
    }

    startSendTransition(async () => {
      const result = await sendRecommendation(savedId);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Recommendation sent to client");
      onOpenChange(false);
      router.refresh();
    });
  }

  function handleDelete() {
    if (isDemoMode) {
      toast.info("Demo mode — view only");
      return;
    }

    if (!savedId) return;

    startDeleteTransition(async () => {
      const result = await deleteDraftRecommendation(savedId, clientId);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      setSummary("");
      setClientSummary("");
      setActions(EMPTY_ACTIONS);
      setHasGenerated(false);
      setSavedId(null);
      toast.success("Draft deleted");
      router.refresh();
    });
  }

  const isFormValid =
    summary.trim().length > 0 &&
    actions.every((a) => a.action.trim().length > 0);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle>Generate Recommendations</SheetTitle>
          <SheetDescription>
            {clientName}
            {score !== null && ` · Score: ${score}/100`}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-5 px-4 pb-6">
          {!hasProfile && !isDemoMode ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  This client hasn&apos;t entered financial data yet.
                  Recommendations require financial data to generate.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing financial data...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    {hasGenerated
                      ? "Regenerate AI Recommendations"
                      : "Generate AI Recommendations"}
                  </>
                )}
              </Button>

              {hasGenerated && (
                <>
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base">
                          Risk Summary
                        </CardTitle>
                        <Badge variant="secondary" className="text-xs gap-1">
                          <SparklesIcon />
                          AI-generated · Editable
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        placeholder="Risk assessment summary..."
                        rows={3}
                        className="resize-none"
                        disabled={isDemoMode}
                      />
                      <p className="text-xs text-muted-foreground mt-1.5">
                        {summary.length}/280 characters
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base">
                          Client Message
                        </CardTitle>
                        <Badge variant="secondary" className="text-xs gap-1">
                          <SparklesIcon />
                          AI-generated · Editable
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={clientSummary}
                        onChange={(e) => setClientSummary(e.target.value)}
                        placeholder="Encouraging message for the client..."
                        rows={3}
                        className="resize-none"
                        disabled={isDemoMode}
                      />
                      <p className="text-xs text-muted-foreground mt-1.5">
                        {clientSummary.length}/280 characters — this is what the client will see
                      </p>
                    </CardContent>
                  </Card>

                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold">Action Items</h3>
                    {actions.map((item, i) => (
                      <fieldset
                        key={i}
                        className="relative rounded-lg border px-4 pb-4 pt-5"
                      >
                        <legend className="px-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Action #{i + 1}
                        </legend>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <Label
                                htmlFor={`sheet-action-${i}`}
                                className="sr-only"
                              >
                                Action
                              </Label>
                              <Textarea
                                id={`sheet-action-${i}`}
                                value={item.action}
                                onChange={(e) =>
                                  updateAction(i, "action", e.target.value)
                                }
                                placeholder="Action recommendation..."
                                rows={2}
                                className="resize-none"
                                disabled={isDemoMode}
                              />
                            </div>
                            <div className="w-28 shrink-0">
                              <Label
                                htmlFor={`sheet-priority-${i}`}
                                className="sr-only"
                              >
                                Priority
                              </Label>
                              <Select
                                value={item.priority}
                                onValueChange={(val) =>
                                  updateAction(i, "priority", val)
                                }
                                disabled={isDemoMode}
                              >
                                <SelectTrigger id={`sheet-priority-${i}`}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="high">High</SelectItem>
                                  <SelectItem value="medium">
                                    Medium
                                  </SelectItem>
                                  <SelectItem value="low">Low</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div>
                            <Label
                              htmlFor={`sheet-rationale-${i}`}
                              className="sr-only"
                            >
                              Rationale
                            </Label>
                            <Textarea
                              id={`sheet-rationale-${i}`}
                              value={item.rationale}
                              onChange={(e) =>
                                updateAction(i, "rationale", e.target.value)
                              }
                              placeholder="Rationale for this action..."
                              rows={2}
                              className="resize-none"
                              disabled={isDemoMode}
                            />
                          </div>
                        </div>
                      </fieldset>
                    ))}
                  </div>

                  {hasPendingRecommendation && (
                    <div className="flex items-start gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2.5">
                      <Info className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-sm text-amber-700 dark:text-amber-400">
                        This client has an active recommendation that hasn&apos;t been completed yet. You can save a draft, but sending is disabled until all previous recommendations are completed.
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div>
                      {savedId &&
                        (isDemoMode ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() =>
                              toast.info("Demo mode — view only")
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete Draft
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={handleDelete}
                            disabled={isDeleting}
                          >
                            {isDeleting ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                            Delete Draft
                          </Button>
                        ))}
                    </div>

                    <div className="flex gap-3">
                      {isDemoMode ? (
                        <Button
                          variant="outline"
                          onClick={() =>
                            toast.info("Demo mode — view only")
                          }
                        >
                          <Save className="h-4 w-4" />
                          Save Draft
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          onClick={handleSave}
                          disabled={isSaving || !isFormValid}
                        >
                          {isSaving ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Save className="h-4 w-4" />
                          )}
                          {savedId ? "Update Draft" : "Save Draft"}
                        </Button>
                      )}

                      {isDemoMode ? (
                        <Button
                          onClick={() =>
                            toast.info("Demo mode — view only")
                          }
                        >
                          <Send className="h-4 w-4" />
                          Send to Client
                        </Button>
                      ) : (
                        <Button
                          onClick={handleSend}
                          disabled={isSending || !savedId || hasPendingRecommendation}
                        >
                          {isSending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Send className="h-4 w-4" />
                          )}
                          Send to Client
                        </Button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function SparklesIcon() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
  );
}
