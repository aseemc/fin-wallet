import { signOut } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b bg-white sticky top-0 z-10">
        <div className="max-w-lg mx-auto flex items-center justify-between px-4 h-14">
          <Link href="/" className="font-bold text-lg">
            FinWallet
          </Link>
          <form action={signOut}>
            <Button variant="ghost" size="sm" type="submit">
              Sign out
            </Button>
          </form>
        </div>
      </header>
      <main className="flex-1 max-w-lg mx-auto w-full">{children}</main>
      <nav className="border-t bg-white sticky bottom-0 z-10">
        <div className="max-w-lg mx-auto flex justify-around py-2">
          <Link
            href="/"
            className="flex flex-col items-center text-xs gap-1 text-muted-foreground hover:text-foreground"
          >
            <HomeIcon />
            Home
          </Link>
          <Link
            href="/data"
            className="flex flex-col items-center text-xs gap-1 text-muted-foreground hover:text-foreground"
          >
            <DataIcon />
            Finances
          </Link>
          <Link
            href="/goal"
            className="flex flex-col items-center text-xs gap-1 text-muted-foreground hover:text-foreground"
          >
            <GoalIcon />
            Goal
          </Link>
          <Link
            href="/recommendations"
            className="flex flex-col items-center text-xs gap-1 text-muted-foreground hover:text-foreground"
          >
            <RecIcon />
            Advice
          </Link>
        </div>
      </nav>
    </div>
  );
}

function HomeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function DataIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function GoalIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function RecIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
