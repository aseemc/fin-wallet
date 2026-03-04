import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function GoalLoading() {
  return (
    <div className="p-4 space-y-6 pb-8 animate-pulse">
      <div>
        <div className="h-8 w-32 bg-muted rounded" />
        <div className="h-4 w-56 bg-muted rounded mt-2" />
      </div>
      <Card>
        <CardHeader>
          <div className="h-5 w-28 bg-muted rounded" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="h-4 w-20 bg-muted rounded" />
            <div className="h-10 bg-muted rounded" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-10 bg-muted rounded" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-10 bg-muted rounded" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-20 bg-muted rounded" />
            <div className="h-10 bg-muted rounded" />
          </div>
          <div className="h-10 bg-muted rounded mt-2" />
        </CardContent>
      </Card>
    </div>
  );
}
