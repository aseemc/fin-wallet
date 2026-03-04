import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AdminLoading() {
  return (
    <div className="animate-pulse">
      <div className="flex items-center justify-between px-4 md:px-8 py-4 border-b">
        <div>
          <div className="h-6 w-24 bg-muted rounded" />
          <div className="h-4 w-40 bg-muted rounded mt-1" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-muted rounded" />
          <div className="h-9 w-9 bg-muted rounded-full" />
        </div>
      </div>

      <div className="px-4 pb-4 md:px-8 md:pb-8 space-y-6 mt-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="h-8 w-12 bg-muted rounded mb-1" />
              <div className="h-3 w-20 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="h-5 w-24 bg-muted rounded" />
        </CardHeader>
        <CardContent>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 py-3 border-b last:border-b-0">
              <div className="h-4 w-32 bg-muted rounded" />
              <div className="h-4 w-40 bg-muted rounded" />
              <div className="h-4 w-16 bg-muted rounded" />
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-4 w-12 bg-muted rounded ml-auto" />
            </div>
          ))}
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
