"use client";

import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DEMO_ADMIN_DATA } from "@/lib/demo-data";
import { getScoreColor, getScoreLabel } from "@/lib/score";

interface ClientRow {
  id: string;
  name: string;
  email: string;
  latestScore: number | null;
  lastUpdated: string | null;
}

interface Props {
  isDemoMode: boolean;
  advisorName?: string;
  clients?: ClientRow[];
}

function formatDate(date: string | null): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ClientListContent({
  isDemoMode,
  advisorName,
  clients: realClients,
}: Props) {
  const clients: ClientRow[] = isDemoMode
    ? DEMO_ADMIN_DATA.clients.map((c) => ({
        id: c.user.id,
        name: c.user.name,
        email: c.user.email,
        latestScore: c.latestScore?.score ?? null,
        lastUpdated: c.latestScore?.created_at ?? c.user.created_at,
      }))
    : (realClients ?? []);

  const name = isDemoMode ? DEMO_ADMIN_DATA.advisor.name : advisorName;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Clients</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back, {name ?? "Advisor"}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold">{clients.length}</p>
            <p className="text-xs text-muted-foreground">Total Clients</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold">
              {clients.filter((c) => (c.latestScore ?? 0) >= 60).length}
            </p>
            <p className="text-xs text-muted-foreground">Healthy (60+)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold">
              {clients.filter(
                (c) => c.latestScore !== null && c.latestScore < 40
              ).length}
            </p>
            <p className="text-xs text-muted-foreground">Needs Attention</p>
          </CardContent>
        </Card>
      </div>

      {clients.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No clients have signed up yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">All Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Health Score</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="w-[80px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">
                      {client.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {client.email}
                    </TableCell>
                    <TableCell>
                      {client.latestScore !== null ? (
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-semibold tabular-nums ${getScoreColor(client.latestScore)}`}
                          >
                            {client.latestScore}
                          </span>
                          <Badge
                            variant="secondary"
                            className={`text-[10px] ${getScoreColor(client.latestScore)}`}
                          >
                            {getScoreLabel(client.latestScore)}
                          </Badge>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          No data
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDate(client.lastUpdated)}
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/admin/client/${client.id}`}
                        className="text-sm font-medium text-primary hover:underline underline-offset-4"
                      >
                        View →
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
