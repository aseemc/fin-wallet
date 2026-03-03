"use client";

import { updateFinancialProfile } from "@/actions/financial-profile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEMO_CLIENT_DATA } from "@/lib/demo-data";
import type { Tables } from "@/lib/supabase/types";
import { useDemoMode } from "@/providers/demo-provider";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface Props {
  isDemoMode: boolean;
  profile?: Tables<"financial_profiles"> | null;
}

export function FinancialDataForm({ isDemoMode, profile: realProfile }: Props) {
  const { isDemoMode: clientDemo } = useDemoMode();
  const isDemo = isDemoMode || clientDemo;
  const profile = isDemo ? DEMO_CLIENT_DATA.profile : realProfile;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isDemo) {
      toast.info("Demo mode — view only");
      return;
    }
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await updateFinancialProfile(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        toast.success("Financial data updated");
        router.push("/");
      }
    });
  }

  return (
    <div className="p-4 space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold">Financial Data</h1>
        <p className="text-sm text-muted-foreground">
          Update your financial profile to recalculate your score
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Monthly Finances</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <CurrencyField
              id="monthly_income"
              label="Monthly Income"
              defaultValue={profile?.monthly_income ?? 0}
              disabled={isDemo}
            />
            <CurrencyField
              id="monthly_expenses"
              label="Monthly Expenses"
              defaultValue={profile?.monthly_expenses ?? 0}
              disabled={isDemo}
            />
            <CurrencyField
              id="total_debt"
              label="Total Debt"
              defaultValue={profile?.total_debt ?? 0}
              disabled={isDemo}
            />
            <CurrencyField
              id="total_savings"
              label="Total Savings"
              defaultValue={profile?.total_savings ?? 0}
              disabled={isDemo}
            />

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button type="submit" className="w-full" disabled={isPending || isDemo}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save & Recalculate Score
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function CurrencyField({
  id,
  label,
  defaultValue,
  disabled,
}: {
  id: string;
  label: string;
  defaultValue: number;
  disabled: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          $
        </span>
        <Input
          id={id}
          name={id}
          type="number"
          min={0}
          step="0.01"
          defaultValue={defaultValue}
          disabled={disabled}
          className="pl-7"
        />
      </div>
    </div>
  );
}
