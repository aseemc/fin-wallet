import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ClientDetailLoading() {
  return (
    <div className="animate-pulse">
      <div className="flex items-center justify-between px-4 md:px-8 py-4 border-b">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-muted rounded" />
          <div>
            <div className="h-6 w-40 bg-muted rounded" />
            <div className="h-4 w-32 bg-muted rounded mt-1" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-muted rounded" />
          <div className="h-9 w-9 bg-muted rounded-full" />
        </div>
      </div>

      <div className="px-4 pb-4 md:px-8 md:pb-8 space-y-6 mt-6 max-w-4xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 flex justify-center">
          <div className="h-36 w-36 rounded-full bg-muted" />
        </div>
        <div className="lg:col-span-2 grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="py-4">
                <div className="h-4 w-24 bg-muted rounded mb-2" />
                <div className="h-6 w-20 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="h-4 w-32 bg-muted rounded" />
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-1">
                <div className="h-3 w-full bg-muted rounded" />
                <div className="h-1.5 bg-muted rounded" />
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <div className="h-4 w-24 bg-muted rounded" />
          </CardHeader>
          <CardContent>
            <div className="h-40 bg-muted rounded" />
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
}
