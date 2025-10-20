import Link from '@/components/link';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/icons/Icon';
import FacebookIcon from '@/components/icons/FacebookIcon';
import InstagramIcon from '@/components/icons/InstagramIcon';
import SnapchatIcon from '@/components/icons/SnapchatIcon';
import TikTokIcon from '@/components/icons/TikTokIcon';
import TwitterIcon from '@/components/icons/TwitterIcon';
import ShareButton from './ShareButton';
import RestaurantFavoriteButton from './RestaurantFavoriteButton';

// Helper function to format review count
function formatReviewCount(count: number): string {
  if (count >= 10000) return `${Math.floor(count / 1000)}k+`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return count.toString();
}

// Helper function to get badge color based on count
function getReviewBadgeColor(count: number): string {
  if (count >= 100) {
    return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg shadow-green-500/30';
  }
  if (count >= 50) {
    return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/30';
  }
  if (count >= 10) {
    return 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 shadow-lg shadow-purple-500/30';
  }
  return 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300';
}

interface RestaurantHeaderProps {
  restaurant: {
    id: string;
    name: string;
    slug: string;
    isVerified?: boolean;
    isPopular?: boolean;
    country?: { name: string } | null;
    cuisineTypes?: string[];
    rating?: number | null;
    reviewCount?: number;
    phone?: string | null;
    latitude?: string | null;
    longitude?: string | null;
    post?: { isPublished: boolean } | null;
    facebook?: string | null;
    instagram?: string | null;
    snapchat?: string | null;
    tiktok?: string | null;
    twitter?: string | null;
    qrCodeUrl?: string | null;
  };
}

export default function RestaurantHeader({ restaurant }: RestaurantHeaderProps) {
  const hasSocialMedia = restaurant.facebook || restaurant.instagram || restaurant.snapchat ||
    restaurant.tiktok || restaurant.twitter;

  return (
    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
      <div className="space-y-2">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-3xl md:text-4xl font-bold">{restaurant.name}</h1>
          {restaurant.isVerified && (
            <Badge className="bg-green-500 text-white">
              <Icon name="BadgeCheck" className="h-4 w-4 mr-1" />
              موثق
            </Badge>
          )}
          {restaurant.isPopular && (
            <Badge variant="secondary">
              <Icon name="TrendingUp" className="h-4 w-4 mr-1" />
              شائع
            </Badge>
          )}
        </div>

        {restaurant.country && (
          <div className="flex items-center gap-2">
            <Badge variant="outline">{restaurant.country.name}</Badge>
            {restaurant.cuisineTypes && restaurant.cuisineTypes.map((cuisine) => (
              <Badge key={cuisine} variant="secondary" className="text-xs">{cuisine}</Badge>
            ))}
          </div>
        )}

        {restaurant.rating && (
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Icon
                  key={star}
                  name="Star"
                  className={`h-5 w-5 ${star <= (restaurant.rating || 0)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-muted-foreground'
                    }`}
                />
              ))}
            </div>
            <span className="text-lg font-semibold">{restaurant.rating.toFixed(1)}</span>
            {restaurant.reviewCount && restaurant.reviewCount > 0 && (
              <span className="text-sm text-muted-foreground">({restaurant.reviewCount} تقييم)</span>
            )}
          </div>
        )}
      </div>

      {/* Quick Actions & Social Media */}
      <div className="flex gap-3 flex-wrap">
        <RestaurantFavoriteButton
          restaurantId={restaurant.id}
          restaurantName={restaurant.name}
        />
        {restaurant.phone && (
          <a href={`tel:${restaurant.phone}`} title="اتصل">
            <button className="flex items-center justify-center w-10 h-10 border rounded-lg hover:bg-muted hover:border-primary/50 transition-all group">
              <Icon name="Phone" className="h-5 w-5 group-hover:text-primary transition-colors" />
            </button>
          </a>
        )}
        {restaurant.latitude && restaurant.longitude && (
          <a
            href={`https://www.google.com/maps?q=${restaurant.latitude},${restaurant.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            title="الموقع"
          >
            <button className="flex items-center justify-center w-10 h-10 border rounded-lg hover:bg-muted hover:border-primary/50 transition-all group">
              <Icon name="MapPin" className="h-5 w-5 group-hover:text-primary transition-colors" />
            </button>
          </a>
        )}
        <Link href={`/restaurant/${restaurant.slug}/reviews`} title="التقييمات">
          <button className="flex items-center justify-center w-10 h-10 border rounded-lg hover:bg-muted transition-all hover:border-primary/50 relative group">
            <Icon name="MessageSquare" className="h-5 w-5 group-hover:text-primary transition-colors" />
            {restaurant.reviewCount !== undefined && restaurant.reviewCount > 0 && (
              <Badge
                className={`
                  absolute -top-2 -right-2 font-semibold text-xs px-1.5 py-0.5 min-w-[20px] h-5 flex items-center justify-center
                  transition-all duration-300 ease-out
                  group-hover:scale-110 group-hover:shadow-xl
                  animate-in fade-in slide-in-from-left-2
                  ${getReviewBadgeColor(restaurant.reviewCount)}
                `}
                title={`${restaurant.reviewCount} تقييم`}
              >
                {formatReviewCount(restaurant.reviewCount)}
              </Badge>
            )}
          </button>
        </Link>
        <ShareButton
          restaurantName={restaurant.name}
          restaurantSlug={restaurant.slug}
          qrCodeUrl={restaurant.qrCodeUrl || undefined}
        />
        {restaurant.post?.isPublished && (
          <Link href={`/restaurant/${restaurant.slug}/blog`} title="المدونة">
            <button className="flex items-center justify-center w-10 h-10 border rounded-lg hover:bg-muted transition-all hover:border-primary/50 group">
              <Icon name="BookOpen" className="h-5 w-5 group-hover:text-primary transition-colors" />
            </button>
          </Link>
        )}

        {/* Social Media Icons */}
        {hasSocialMedia && (
          <>
            <div className="w-px h-10 bg-border self-center" />
            {restaurant.facebook && (
              <a
                href={restaurant.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 border rounded-lg text-muted-foreground hover:text-[#1877F2] hover:bg-[#1877F2]/10 hover:border-[#1877F2]/50 transition-all"
                title="Facebook"
              >
                <FacebookIcon className="h-5 w-5" />
              </a>
            )}
            {restaurant.instagram && (
              <a
                href={restaurant.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 border rounded-lg text-muted-foreground hover:text-[#E4405F] hover:bg-[#E4405F]/10 hover:border-[#E4405F]/50 transition-all"
                title="Instagram"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
            )}
            {restaurant.snapchat && (
              <a
                href={restaurant.snapchat}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 border rounded-lg text-muted-foreground hover:text-[#FFFC00] hover:bg-[#FFFC00]/10 hover:border-[#FFFC00]/50 transition-all"
                title="Snapchat"
              >
                <SnapchatIcon className="h-5 w-5" />
              </a>
            )}
            {restaurant.tiktok && (
              <a
                href={restaurant.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 border rounded-lg text-muted-foreground hover:text-black hover:bg-black/10 hover:border-black/50 transition-all"
                title="TikTok"
              >
                <TikTokIcon className="h-5 w-5" />
              </a>
            )}
            {restaurant.twitter && (
              <a
                href={restaurant.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 border rounded-lg text-muted-foreground hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/10 hover:border-[#1DA1F2]/50 transition-all"
                title="Twitter/X"
              >
                <TwitterIcon className="h-5 w-5" />
              </a>
            )}
          </>
        )}
      </div>
    </div>
  );
}

