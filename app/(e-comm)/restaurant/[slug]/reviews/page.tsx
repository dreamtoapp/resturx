import { notFound } from 'next/navigation';
import Link from '@/components/link';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icons/Icon';
import { getRestaurantReviews } from './actions/getRestaurantReviews';
import { checkReviewEligibility } from './actions/checkReviewEligibility';
import ReviewCard from './components/ReviewCard';
import ReviewForm from './components/ReviewForm';
import ReviewEligibilityAlert from './components/ReviewEligibilityAlert';

export default async function RestaurantReviewsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [restaurant, eligibility] = await Promise.all([
    getRestaurantReviews(slug),
    checkReviewEligibility(slug)
  ]);

  if (!restaurant) {
    notFound();
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href={`/restaurant/${restaurant.slug}`}>
          <Button variant="ghost" className="mb-4">
            <Icon name="ArrowRight" className="h-4 w-4 ml-2" />
            العودة للمطعم
          </Button>
        </Link>
        <h1 className="text-3xl font-bold mb-2">التقييمات</h1>
        <p className="text-muted-foreground">
          تقييمات عملاء {restaurant.name}
        </p>
      </div>

      {/* Review Eligibility Alert */}
      <div className="mb-8">
        <ReviewEligibilityAlert
          canReview={eligibility.canReview}
          reason={eligibility.reason || ''}
        />
      </div>

      {/* Review Form (if eligible) */}
      {eligibility.canReview && (
        <div className="mb-8">
          <ReviewForm restaurantSlug={restaurant.slug} />
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            التقييمات ({restaurant.reviews.length})
          </h2>
        </div>

        {restaurant.reviews.length === 0 ? (
          <div className="text-center py-12 bg-muted/30 rounded-lg">
            <Icon name="MessageSquare" className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">لا توجد تقييمات بعد</h3>
            <p className="text-muted-foreground">
              كن أول من يكتب تقييماً لهذا المطعم
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {restaurant.reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

