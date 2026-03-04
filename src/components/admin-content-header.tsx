"use client";

import { signOut } from "@/actions/auth";
import { useDemoMode } from "@/providers/demo-provider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";

export function AdminContentHeader({
  children,
}: {
  children?: React.ReactNode;
}) {
  const { isDemoMode, exitDemo } = useDemoMode();

  return (
    <div className="sticky top-0 z-10 flex items-center justify-between px-4 md:px-8 py-4 border-b bg-background">
      <div className="min-w-0">{children}</div>
      <div className="flex items-center gap-3 shrink-0">
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <Avatar className="cursor-pointer size-9">
                <AvatarFallback className="bg-primary/10 text-primary font-medium text-sm">
                  A
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem>
              <User className="h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {isDemoMode ? (
              <DropdownMenuItem onClick={exitDemo}>
                <LogOut className="h-4 w-4" />
                Exit demo
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => signOut()}>
                <LogOut className="h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
