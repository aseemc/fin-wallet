"use client";

import { upsertGoal } from "@/actions/goals";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { DEMO_CLIENT_DATA } from "@/lib/demo-data";
import type { Tables } from "@/lib/supabase/types";
import { useDemoMode } from "@/providers/demo-provider";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface Props {
  isDemoMode: boolean;
  goal?: Tables<"goals"> | null;
}

export function GoalForm({ isDemoMode, goal: realGoal }: Props) {
  const { isDemoMode: clientDemo } = useDemoMode();
  const isDemo = isDemoMode || clientDemo;
  const goal = isDemo ? DEMO_CLIENT_DATA.goal : realGoal;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const progress = goal
    ? Math.min(100, ((goal.current_amount ?? 0) / goal.target_amount) * 100)
    : 0;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isDemo) {
      toast.info("Demo mode — view only");
      return;
    }
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await upsertGoal(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        toast.success(goal ? "Goal updated" : "Goal created");
        router.push("/");
      }
    });
  }

  return (
    <div className="p-4 space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold">
          {goal ? "Update Goal" : "Set a Goal"}
        </h1>
        <p className="text-sm text-muted-foreground">
          Define a financial target to work toward
        </p>
      </div>

      {goal && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Current Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="font-medium">{goal.title}</span>
              <span className="text-sm text-muted-foreground">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                ${(goal.current_amount ?? 0).toLocaleString()}
              </span>
              <span>
                ${goal.target_amount.toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {goal ? "Edit Goal" : "New Goal"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {goal && (
              <input type="hidden" name="goal_id" value={goal.id} />
            )}

            <div className="space-y-2">
              <Label htmlFor="title">Goal Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., Build emergency fund"
                defaultValue={goal?.title ?? ""}
                disabled={isDemo}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="target_amount">Target Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="target_amount"
                    name="target_amount"
                    type="number"
                    min={1}
                    step="0.01"
                    defaultValue={goal?.target_amount ?? ""}
                    disabled={isDemo}
                    className="pl-7"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="current_amount">Current Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="current_amount"
                    name="current_amount"
                    type="number"
                    min={0}
                    step="0.01"
                    defaultValue={goal?.current_amount ?? 0}
                    disabled={isDemo}
                    className="pl-7"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline (optional)</Label>
              <Input
                id="deadline"
                name="deadline"
                type="date"
                defaultValue={goal?.deadline ?? ""}
                disabled={isDemo}
              />
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button type="submit" className="w-full" disabled={isPending || isDemo}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {goal ? "Update Goal" : "Create Goal"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
