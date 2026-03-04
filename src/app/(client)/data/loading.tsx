import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DataLoading() {
  return (
    <div className="p-4 space-y-6 pb-8 animate-pulse">
      <div>
        <div className="h-8 w-40 bg-muted rounded" />
        <div className="h-4 w-64 bg-muted rounded mt-2" />
      </div>
      <Card>
        <CardHeader>
          <div className="h-5 w-32 bg-muted rounded" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-10 bg-muted rounded" />
            </div>
          ))}
          <div className="h-10 bg-muted rounded mt-2" />
        </CardContent>
      </Card>
    </div>
  );
}
