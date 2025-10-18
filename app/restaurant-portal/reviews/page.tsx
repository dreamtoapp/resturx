import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/icons/Icon';
import { getOwnerReviews } from './actions/getOwnerReviews';
import ReviewManagementCard from './components/ReviewManagementCard';

export default async function ReviewsManagementPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect('/login');
  }

  const restaurant = await getOwnerReviews();

  if (!restaurant) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="p-8 text-center">
            <Icon name="AlertCircle" className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">لم يتم العثور على المطعم</h3>
            <p className="text-muted-foreground">
              لا يمكنك إدارة التقييمات بدون مطعم مسجل
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const allReviews = restaurant.reviews;
  const reportedReviews = allReviews.filter((r) => r.isReported);
  const respondedReviews = allReviews.filter((r) => r.ownerResponse);

  // Calculate average rating
  const avgRating = allReviews.length > 0
    ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1)
    : '0.0';

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">إدارة التقييمات</h1>
        <p className="text-muted-foreground">
          اعرض تقييمات العملاء ورد عليها
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">جميع التقييمات</p>
                <p className="text-2xl font-bold">{allReviews.length}</p>
              </div>
              <Icon name="MessageSquare" className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">متوسط التقييم</p>
                <p className="text-2xl font-bold">⭐ {avgRating}</p>
              </div>
              <Icon name="Star" className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">تم الرد عليها</p>
                <p className="text-2xl font-bold">{respondedReviews.length}</p>
              </div>
              <Icon name="MessageCircle" className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">مُبلغ عنها</p>
                <p className="text-2xl font-bold">{reportedReviews.length}</p>
              </div>
              <Icon name="AlertTriangle" className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">جميع التقييمات</h2>
          {reportedReviews.length > 0 && (
            <Badge variant="destructive">
              {reportedReviews.length} مُبلغ عنها
            </Badge>
          )}
        </div>

        {allReviews.length === 0 ? (
          <EmptyState message="لا توجد تقييمات بعد" />
        ) : (
          <div className="space-y-4">
            {allReviews.map((review) => (
              <ReviewManagementCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <Card>
      <CardContent className="p-12 text-center">
        <Icon name="MessageSquare" className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">{message}</p>
      </CardContent>
    </Card>
  );
}

