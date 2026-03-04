"use client";

import { setVertical } from "@/actions/vertical";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useActionState, useState } from "react";

const VERTICALS = [
  { value: "finance", label: "Finance", enabled: true },
  { value: "health", label: "Health", enabled: false },
  { value: "tax", label: "Tax", enabled: false },
  { value: "legal", label: "Legal", enabled: false },
] as const;

export default function SelectVerticalPage() {
  const [selected, setSelected] = useState("");

  const [state, formAction, isPending] = useActionState(
    async (_prev: { error: string } | null, formData: FormData) => {
      const result = await setVertical(formData);
      return result ?? null;
    },
    null
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-900 dark:to-slate-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Choose Your Vertical
          </CardTitle>
          <CardDescription>
            Select the area you specialize in to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            <input type="hidden" name="vertical" value={selected} />
            <Select value={selected} onValueChange={setSelected}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a vertical..." />
              </SelectTrigger>
              <SelectContent>
                {VERTICALS.map((v) => (
                  <SelectItem
                    key={v.value}
                    value={v.value}
                    disabled={!v.enabled}
                    className={!v.enabled ? "opacity-50" : ""}
                  >
                    <span className="flex items-center gap-2">
                      {v.label}
                      {!v.enabled && (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                          Coming Soon
                        </Badge>
                      )}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {state?.error && (
              <p className="text-sm text-destructive">{state.error}</p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={!selected || isPending}
            >
              {isPending ? "Setting up..." : "Continue"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
