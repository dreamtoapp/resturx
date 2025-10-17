import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="space-y-6" dir="rtl">
      {/* Logo Upload Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-6 w-40" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Logo Display */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-32 w-32 rounded-lg" />
          </div>

          {/* Upload Section */}
          <div className="space-y-4">
            <Skeleton className="h-4 w-48" />
            <div className="border-2 border-dashed border-muted rounded-lg p-8">
              <div className="flex flex-col items-center justify-center space-y-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 text-center">
                  <Skeleton className="h-4 w-48 mx-auto" />
                  <Skeleton className="h-3 w-64 mx-auto" />
                </div>
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </div>

          {/* Logo Guidelines */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-40" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-56" />
              <Skeleton className="h-3 w-52" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end pt-6 border-t">
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}




