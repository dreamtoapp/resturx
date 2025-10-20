export const revalidate = 60;
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageProps } from '@/types/commonTypes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import StickyBreadcrumb from '@/components/StickyBreadcrumb';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { getRestaurantProfile } from './actions/getRestaurantProfile';
import { getDishCategories } from './actions/getDishCategories';
import RestaurantHero from './components/RestaurantHero';
import RestaurantHeader from './components/RestaurantHeader';
import RestaurantOverviewTab from './components/RestaurantOverviewTab';
import RestaurantMenuTab from './components/RestaurantMenuTab';
import RestaurantCartTab from './components/RestaurantCartTab';
import CartBadge from './components/CartBadge';
import RestaurantOrdersTab from './components/RestaurantOrdersTab';
import RestaurantFavoriteDishesTab from './components/RestaurantFavoriteDishesTab';
import RestaurantMyReviewsTab from './components/RestaurantMyReviewsTab';
import RestaurantGalleryTab from './components/RestaurantGalleryTab';
import RestaurantVideosTab from './components/RestaurantVideosTab';
import RestaurantInfoTab from './components/RestaurantInfoTab';
import FloatingWhatsAppButton from './components/FloatingWhatsAppButton';
import QRTracker from './components/QRTracker';

export async function generateMetadata({ params }: PageProps<{ slug: string }>): Promise<Metadata> {
  const { slug } = await params;
  const restaurant = await getRestaurantProfile(slug);

  if (!restaurant) {
    return {
      title: 'Restaurant Not Found',
    };
  }

  return {
    title: restaurant.name,
    description: restaurant.description || restaurant.bio || `${restaurant.name} - ${restaurant.country?.name}`,
    openGraph: {
      title: restaurant.name,
      description: restaurant.description || '',
      images: restaurant.coverImage ? [restaurant.coverImage] : restaurant.imageUrl ? [restaurant.imageUrl] : [],
    },
  };
}

export default async function RestaurantProfilePage({ params }: PageProps<{ slug: string }>) {
  const { slug } = await params;
  const session = await auth();

  const [restaurant, categories] = await Promise.all([
    getRestaurantProfile(slug),
    getDishCategories()
  ]);

  if (!restaurant || restaurant.status !== 'ACTIVE') {
    notFound();
  }

  // Get user's orders, favorites, and reviews for this restaurant (if logged in)
  let orders: any[] = [];
  let favorites: any[] = [];
  let reviews: any[] = [];

  if (session?.user?.id) {
    // Get all dish IDs from this restaurant
    const restaurantDishIds = restaurant.dishes.map((d: any) => d.id);

    [orders, favorites, reviews] = await Promise.all([
      // Orders
      prisma.dineInOrder.findMany({
        where: {
          restaurantId: restaurant.id,
          customerId: session.user.id
        },
        include: {
          items: {
            select: {
              id: true,
              dishId: true,
              dishName: true,
              dishImage: true,
              quantity: true,
              price: true,
              notes: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 20 // Limit to last 20 orders
      }),
      // Favorites
      prisma.wishlistItem.findMany({
        where: {
          userId: session.user.id,
          productId: { in: restaurantDishIds }
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              description: true,
              price: true,
              imageUrl: true,
              rating: true,
              dishCategoryId: true,
              dishCategory: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      // Reviews
      prisma.review.findMany({
        where: {
          userId: session.user.id,
          productId: { in: restaurantDishIds }
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              description: true,
              price: true,
              imageUrl: true,
              dishCategoryId: true,
              dishCategory: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
    ]);
  }

  return (
    <>
      {/* QR Code Tracking */}
      <QRTracker restaurantId={restaurant.id} />

      {/* Breadcrumb Navigation */}
      <StickyBreadcrumb
        items={[
          { label: 'الرئيسية', href: '/', icon: 'Home' },
          { label: 'المطابخ', href: '/cuisines', icon: 'UtensilsCrossed' },
          { label: restaurant.country?.name || 'المطاعم', href: `/cuisines/${restaurant.country?.slug}` },
          { label: restaurant.name }
        ]}
      />

      {/* Spacer for fixed breadcrumb */}
      <div className="h-12" />

      <div className="container mx-auto pt-16 pb-12">
        {/* Hero Section */}
        <RestaurantHero
          coverImage={restaurant.coverImage}
          imageUrl={restaurant.imageUrl}
          name={restaurant.name}
        />

        {/* Restaurant Header Info */}
        <RestaurantHeader restaurant={restaurant} />

        {/* Tabs Navigation */}
        <Tabs defaultValue="overview" className="space-y-6">
          <div className="flex justify-center">
            <TabsList className="grid w-full grid-cols-9 md:w-auto md:inline-grid">
              <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
              <TabsTrigger value="menu" className="gap-2">
                قائمة الطعام
                {restaurant.dishesCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {restaurant.dishesCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="cart" className="gap-2">
                السلة
                <CartBadge restaurantId={restaurant.id} />
              </TabsTrigger>
              <TabsTrigger value="orders" className="gap-2">
                طلباتي
                {session?.user && orders.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {orders.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="favorites" className="gap-2">
                مفضلتي
                {session?.user && favorites.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {favorites.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="reviews" className="gap-2">
                تقييماتي
                {session?.user && reviews.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {reviews.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="gallery" className="gap-2">
                الصور
                {restaurant.imagesCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {restaurant.imagesCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="videos" className="gap-2">
                الفيديوهات
                {restaurant.videosCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {restaurant.videosCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="info">معلومات الاتصال</TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <RestaurantOverviewTab restaurant={restaurant} />
          </TabsContent>

          {/* Menu Tab */}
          <TabsContent value="menu">
            <RestaurantMenuTab
              dishes={restaurant.dishes}
              categories={categories}
              restaurantSlug={restaurant.slug}
              restaurantId={restaurant.id}
              restaurantName={restaurant.name}
            />
          </TabsContent>

          {/* Cart Tab */}
          <TabsContent value="cart">
            <RestaurantCartTab
              restaurantId={restaurant.id}
              restaurantName={restaurant.name}
              restaurantSlug={restaurant.slug}
            />
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <RestaurantOrdersTab
              orders={orders}
              isLoggedIn={!!session?.user}
            />
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites">
            <RestaurantFavoriteDishesTab
              favorites={favorites}
              isLoggedIn={!!session?.user}
            />
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <RestaurantMyReviewsTab
              reviews={reviews}
              isLoggedIn={!!session?.user}
            />
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery">
            <RestaurantGalleryTab images={restaurant.images} restaurantName={restaurant.name} />
          </TabsContent>

          {/* Videos Tab */}
          <TabsContent value="videos">
            <RestaurantVideosTab videos={restaurant.videos} restaurantName={restaurant.name} />
          </TabsContent>

          {/* Info Tab */}
          <TabsContent value="info">
            <RestaurantInfoTab restaurant={restaurant} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Floating WhatsApp CTA Button */}
      {restaurant.whatsapp && (
        <FloatingWhatsAppButton whatsapp={restaurant.whatsapp} restaurantName={restaurant.name} />
      )}
    </>
  );
}
