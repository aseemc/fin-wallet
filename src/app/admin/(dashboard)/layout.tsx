import { DemoBanner } from "@/components/demo-banner";
import { MobileAdminNav } from "@/components/mobile-admin-nav";
import { SignOutButton } from "@/components/sign-out-button";
import Link from "next/link";

export default function AdvisorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <DemoBanner />

      {/* Mobile header - visible on small screens */}
      <header className="md:hidden border-b bg-background sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <MobileAdminNav />
            <Link href="/admin" className="font-bold text-lg">
              FinWallet
            </Link>
          </div>
          <div className="flex items-center gap-1">
            <SignOutButton />
          </div>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* Desktop sidebar - hidden on mobile */}
        <aside className="hidden md:flex w-64 border-r bg-background flex-col shrink-0">
          <div className="p-6">
            <Link href="/admin" className="font-bold text-lg">
              FinWallet
            </Link>
            <p className="text-xs text-muted-foreground mt-1">Advisor Console</p>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            <Link
              href="/admin"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-muted"
            >
              <UsersIcon />
              Clients
            </Link>
          </nav>
        </aside>
        <main className="flex-1 min-w-0 overflow-y-auto">{children}</main>
      </div>
    </div>
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
