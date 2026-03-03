"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import type { Tables } from "@/lib/supabase/types";

const chartConfig = {
  score: {
    label: "Score",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

interface ScoreChartProps {
  snapshots: Tables<"score_snapshots">[];
}

export function ScoreChart({ snapshots }: ScoreChartProps) {
  const data = snapshots.map((s) => ({
    date: new Date(s.created_at!).toLocaleDateString("en-US", {
      month: "short",
      year: "2-digit",
    }),
    score: s.score,
  }));

  if (data.length < 2) {
    return (
      <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
        Score history will appear after your second update.
      </div>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="h-[200px] w-full">
      <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
        <defs>
          <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-score)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--color-score)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="date" tickLine={false} axisLine={false} fontSize={12} />
        <YAxis domain={[0, 100]} tickLine={false} axisLine={false} fontSize={12} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          type="monotone"
          dataKey="score"
          stroke="var(--color-score)"
          strokeWidth={2}
          fill="url(#scoreGradient)"
        />
      </AreaChart>
    </ChartContainer>
  );
}
