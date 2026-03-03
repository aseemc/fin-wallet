"use client";

import { useDemoMode } from "@/providers/demo-provider";
import { Button } from "@/components/ui/button";
import { Eye, X } from "lucide-react";

export function DemoBanner() {
  const { isDemoMode, exitDemo } = useDemoMode();

  if (!isDemoMode) return null;

  return (
    <div className="sticky top-0 z-50 flex items-center justify-center gap-3 bg-amber-500 px-4 py-2 text-sm font-medium text-amber-950">
      <Eye className="h-4 w-4 shrink-0" />
      <span>Demo Mode &mdash; Visual Only</span>
      <Button
        variant="outline"
        size="sm"
        className="ml-2 h-6 border-amber-700 bg-amber-400 px-2 text-xs text-amber-950 hover:bg-amber-300"
        onClick={exitDemo}
      >
        <X className="mr-1 h-3 w-3" />
        Exit
      </Button>
    </div>
  );
}
