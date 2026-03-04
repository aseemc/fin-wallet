"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Check, DollarSign, Heart, FileText, Scale } from "lucide-react";

const WALLETS = [
  { key: "finance", label: "Finance Wallet", icon: DollarSign, enabled: true },
  { key: "health", label: "Health Wallet", icon: Heart, enabled: false },
  { key: "tax", label: "Tax Wallet", icon: FileText, enabled: false },
  { key: "legal", label: "Legal Wallet", icon: Scale, enabled: false },
] as const;

export function WalletSwitcher() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1 font-bold text-lg outline-none">
        Finance Wallet
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {WALLETS.map((wallet) => {
          const Icon = wallet.icon;
          return (
            <DropdownMenuItem
              key={wallet.key}
              disabled={!wallet.enabled}
              className={!wallet.enabled ? "opacity-50" : ""}
            >
              <Icon className="mr-2 h-4 w-4" />
              <span className="flex-1">{wallet.label}</span>
              {wallet.enabled && (
                <Check className="ml-2 h-4 w-4 text-primary" />
              )}
              {!wallet.enabled && (
                <Badge variant="secondary" className="ml-2 text-[10px] px-1.5 py-0">
                  Soon
                </Badge>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
