"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export function MobileAdminNav({ walletLabel = "Finance Wallet" }: { walletLabel?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setOpen(true)}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Open menu</span>
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64">
          <SheetHeader>
            <SheetTitle>{walletLabel}</SheetTitle>
            <p className="text-xs text-muted-foreground">Advisor Console</p>
          </SheetHeader>
          <nav className="mt-4 space-y-1">
            <Link
              href="/admin"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-muted"
              onClick={() => setOpen(false)}
            >
              <UsersIcon />
              Clients
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
}

function UsersIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
