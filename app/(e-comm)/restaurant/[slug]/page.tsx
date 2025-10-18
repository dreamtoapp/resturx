export const revalidate = 60;
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageProps } from '@/types/commonTypes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StickyBreadcrumb from '@/components/StickyBreadcrumb';
import { getRestaurantProfile } from './actions/getRestaurantProfile';
import RestaurantHero from './components/RestaurantHero';
import RestaurantHeader from './components/RestaurantHeader';
import RestaurantOverviewTab from './components/RestaurantOverviewTab';
import RestaurantMenuTab from './components/RestaurantMenuTab';
import RestaurantGalleryTab from './components/RestaurantGalleryTab';
import RestaurantInfoTab from './components/RestaurantInfoTab';
import FloatingWhatsAppButton from './components/FloatingWhatsAppButton';

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
  const restaurant = await getRestaurantProfile(slug);

  if (!restaurant || restaurant.status !== 'ACTIVE') {
    notFound();
  }

  return (
    <>
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
            <TabsList className="grid w-full grid-cols-4 md:w-auto md:inline-grid">
              <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
              <TabsTrigger value="menu">القائمة</TabsTrigger>
              <TabsTrigger value="gallery">الصور</TabsTrigger>
              <TabsTrigger value="info">معلومات الاتصال</TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <RestaurantOverviewTab restaurant={restaurant} />
          </TabsContent>

          {/* Menu Tab */}
          <TabsContent value="menu">
            <RestaurantMenuTab dishes={restaurant.dishes} restaurantSlug={restaurant.slug} />
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery">
            <RestaurantGalleryTab images={restaurant.images} restaurantName={restaurant.name} />
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
