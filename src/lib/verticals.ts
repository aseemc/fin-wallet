export const VALID_VERTICALS = ["finance", "health", "tax", "legal"] as const;
export type Vertical = (typeof VALID_VERTICALS)[number];

export const VERTICAL_LABELS: Record<Vertical, string> = {
  finance: "Finance Wallet",
  health: "Health Wallet",
  tax: "Tax Wallet",
  legal: "Legal Wallet",
};

export const ENABLED_VERTICALS: Set<Vertical> = new Set(["finance"]);
