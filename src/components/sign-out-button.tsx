"use client";

import { signOut } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { useDemoMode } from "@/providers/demo-provider";

export function SignOutButton({ className }: { className?: string }) {
  const { isDemoMode, exitDemo } = useDemoMode();

  if (isDemoMode) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className={className}
        onClick={exitDemo}
      >
        Exit demo
      </Button>
    );
  }

  return (
    <form action={signOut}>
      <Button variant="ghost" size="sm" className={className} type="submit">
        Sign out
      </Button>
    </form>
  );
}
