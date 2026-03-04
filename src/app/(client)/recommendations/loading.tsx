import { Card, CardContent } from "@/components/ui/card";

export default function RecommendationsLoading() {
  return (
    <div className="px-4 py-6 space-y-4 animate-pulse">
      <div>
        <div className="h-7 w-52 bg-muted rounded" />
        <div className="h-4 w-40 bg-muted rounded mt-2" />
      </div>
      <Card>
        <CardContent className="py-0">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between py-4 border-b last:border-b-0">
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-muted rounded" />
                <div className="h-3 w-1/2 bg-muted rounded" />
              </div>
              <div className="h-6 w-20 bg-muted rounded ml-4" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
