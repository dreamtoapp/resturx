import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function RestaurantProfileLoading() {
  return (
    <>
      {/* Breadcrumb Skeleton */}
      <div className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-12 items-center gap-2">
          <Skeleton className="h-4 w-16" />
          <span className="text-muted-foreground">/</span>
          <Skeleton className="h-4 w-20" />
          <span className="text-muted-foreground">/</span>
          <Skeleton className="h-4 w-24" />
          <span className="text-muted-foreground">/</span>
          <Skeleton className="h-4 w-32" />
        </div>
      </div>

      {/* Spacer for fixed breadcrumb */}
      <div className="h-12" />

      <div className="container mx-auto pt-16 pb-12">
        {/* Hero Section Skeleton */}
        <div className="relative h-64 md:h-80 mb-8 rounded-b-3xl overflow-hidden bg-muted">
          <Skeleton className="w-full h-full" />
          {/* Logo Skeleton */}
          <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8">
            <Skeleton className="w-24 h-24 md:w-32 md:h-32 rounded-2xl" />
          </div>
        </div>

        {/* Restaurant Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
          <div className="space-y-3 flex-1">
            {/* Name */}
            <Skeleton className="h-10 w-2/3" />

            {/* Badges */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-24" />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div className="space-y-6">
          {/* Tabs List */}
          <div className="flex justify-center">
            <div className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 gap-1">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-32" />
            </div>
          </div>

          {/* Tab Content - Overview Cards */}
          <div className="space-y-6">
            {/* About Card */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
            </Card>

            {/* Services Card */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Delivery Info Card */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-36" />
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Floating Button Skeleton */}
      <div className="fixed bottom-6 left-6 z-50">
        <Skeleton className="h-14 w-14 rounded-full" />
      </div>
    </>
  );
}

