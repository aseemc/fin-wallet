import { Card, CardContent } from "@/components/ui/card";

export default function ClientLoading() {
  return (
    <div className="space-y-6 p-4 pb-8 animate-pulse">
      <div>
        <div className="h-8 w-48 bg-muted rounded" />
        <div className="h-4 w-32 bg-muted rounded mt-2" />
      </div>

      <div className="flex justify-center">
        <div className="h-32 w-32 rounded-full bg-muted" />
      </div>

      <Card>
        <CardContent className="py-6">
          <div className="h-4 w-24 bg-muted rounded mb-4" />
          <div className="h-40 bg-muted rounded" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="py-4">
              <div className="h-4 w-16 bg-muted rounded mb-2" />
              <div className="h-6 w-24 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
