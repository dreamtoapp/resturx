export const revalidate = 60;
import { Metadata } from 'next';
import Image from 'next/image';
import Link from '@/components/link';
import { notFound } from 'next/navigation';
import { PageProps } from '@/types/commonTypes';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Icon } from '@/components/icons/Icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import prisma from '@/lib/prisma';

async function getRestaurantProfile(slug: string) {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { slug },
      include: {
        country: true,
        services: {
          where: { isActive: true },
          orderBy: { displayOrder: 'asc' }
        },
        features: {
          where: { isActive: true },
          orderBy: { displayOrder: 'asc' }
        },
        images: {
          orderBy: { order: 'asc' }
        },
        dishes: {
          where: { published: true, outOfStock: false },
          take: 12,
          orderBy: { createdAt: 'desc' }
        },
      },
    });

    return restaurant;
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    return null;
  }
}

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
    <div className="container mx-auto pb-12">
      {/* Hero Section */}
      <div className="relative h-64 md:h-80 -mt-16 mb-8 rounded-b-3xl overflow-hidden">
        {restaurant.coverImage || restaurant.imageUrl ? (
          <Image
            src={restaurant.coverImage || restaurant.imageUrl || ''}
            alt={restaurant.name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

        {/* Restaurant Logo */}
        <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8">
          <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden border-4 border-background shadow-xl">
            <Image
              src={restaurant.imageUrl || '/placeholder.svg'}
              alt={`${restaurant.name} logo`}
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Restaurant Header Info */}
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
              {restaurant.reviewCount > 0 && (
                <span className="text-sm text-muted-foreground">({restaurant.reviewCount} تقييم)</span>
              )}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          {restaurant.phone && (
            <a href={`tel:${restaurant.phone}`}>
              <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-muted">
                <Icon name="Phone" className="h-4 w-4" />
                <span>اتصل</span>
              </button>
            </a>
          )}
          {restaurant.latitude && restaurant.longitude && (
            <a
              href={`https://www.google.com/maps?q=${restaurant.latitude},${restaurant.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-muted">
                <Icon name="MapPin" className="h-4 w-4" />
                <span>الموقع</span>
              </button>
            </a>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 md:w-auto md:inline-grid">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="menu">القائمة</TabsTrigger>
          <TabsTrigger value="gallery">الصور</TabsTrigger>
          <TabsTrigger value="info">معلومات الاتصال</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* About */}
          {restaurant.bio && (
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">عن المطعم</h2>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-line">{restaurant.bio}</p>
              </CardContent>
            </Card>
          )}

          {/* Specialties */}
          {restaurant.specialties && restaurant.specialties.length > 0 && (
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">الأطباق المميزة</h2>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {restaurant.specialties.map((specialty, idx) => (
                    <Badge key={idx} variant="secondary" className="text-sm">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Services & Amenities */}
          {restaurant.services && restaurant.services.length > 0 && (
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">الخدمات والمرافق</h2>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {restaurant.services.map((service) => (
                    <div key={service.id} className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xl">{getServiceIcon(service.icon)}</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{service.name}</p>
                        {service.description && (
                          <p className="text-xs text-muted-foreground">{service.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Features */}
          {restaurant.features && restaurant.features.length > 0 && (
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">ما يميزنا</h2>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {restaurant.features.map((feature) => (
                    <div key={feature.id} className="flex gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-2xl">{getServiceIcon(feature.icon)}</span>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Delivery Info */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">معلومات التوصيل</h2>
            </CardHeader>
            <CardContent className="space-y-3">
              {restaurant.deliveryTime && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">وقت التوصيل:</span>
                  <span className="font-medium">{restaurant.deliveryTime}</span>
                </div>
              )}
              {restaurant.minOrder !== null && restaurant.minOrder !== undefined && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">الحد الأدنى للطلب:</span>
                  <span className="font-medium">{restaurant.minOrder} ريال</span>
                </div>
              )}
              {restaurant.deliveryFee !== null && restaurant.deliveryFee !== undefined && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">رسوم التوصيل:</span>
                  <span className="font-medium">{restaurant.deliveryFee} ريال</span>
                </div>
              )}
              {restaurant.hasOwnDelivery && (
                <Badge className="w-full justify-center" variant="outline">
                  <Icon name="Truck" className="h-4 w-4 mr-2" />
                  المطعم لديه خدمة توصيل خاصة
                </Badge>
              )}
            </CardContent>
          </Card>

          {/* Payment Methods */}
          {restaurant.paymentMethods && restaurant.paymentMethods.length > 0 && (
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">طرق الدفع المقبولة</h2>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {restaurant.paymentMethods.map((method, idx) => (
                    <Badge key={idx} variant="outline">
                      {method}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Menu Tab */}
        <TabsContent value="menu" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">القائمة</h2>
            <Link href={`/restaurant/${restaurant.slug}/menu`}>
              <button className="text-sm text-primary hover:underline">
                عرض القائمة الكاملة ←
              </button>
            </Link>
          </div>

          {restaurant.dishes && restaurant.dishes.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {restaurant.dishes.map((dish) => (
                <Card key={dish.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-40 bg-muted">
                    <Image
                      src={dish.imageUrl || '/placeholder.svg'}
                      alt={dish.name}
                      fill
                      className="object-cover"
                    />
                    {dish.outOfStock && (
                      <Badge className="absolute top-2 right-2" variant="destructive">
                        نفذ
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-1">{dish.name}</h3>
                    {dish.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {dish.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">{dish.price} ريال</span>
                      <Link href={`/product/${dish.slug}`}>
                        <button className="text-sm text-primary hover:underline">
                          التفاصيل →
                        </button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">لا توجد أطباق متاحة حالياً</p>
            </Card>
          )}
        </TabsContent>

        {/* Gallery Tab */}
        <TabsContent value="gallery">
          {restaurant.images && restaurant.images.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {restaurant.images.map((image, idx) => (
                <div key={image.id} className="relative aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={image.imageUrl}
                    alt={image.caption || `${restaurant.name} image ${idx + 1}`}
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-300"
                  />
                  {image.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-background/80 p-2">
                      <p className="text-xs text-center">{image.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">لا توجد صور متاحة</p>
            </Card>
          )}
        </TabsContent>

        {/* Info Tab */}
        <TabsContent value="info" className="space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">معلومات الاتصال</h2>
            </CardHeader>
            <CardContent className="space-y-3">
              {restaurant.phone && (
                <div className="flex items-center gap-3">
                  <Icon name="Phone" className="h-5 w-5 text-primary" />
                  <a href={`tel:${restaurant.phone}`} className="hover:underline">
                    {restaurant.phone}
                  </a>
                </div>
              )}
              {restaurant.email && (
                <div className="flex items-center gap-3">
                  <Icon name="Mail" className="h-5 w-5 text-primary" />
                  <a href={`mailto:${restaurant.email}`} className="hover:underline">
                    {restaurant.email}
                  </a>
                </div>
              )}
              {restaurant.address && (
                <div className="flex items-start gap-3">
                  <Icon name="MapPin" className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <span>{restaurant.address}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Working Hours */}
          {restaurant.workingHours && (
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">ساعات العمل</h2>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{restaurant.workingHours}</p>
              </CardContent>
            </Card>
          )}

          {/* Location Map */}
          {restaurant.latitude && restaurant.longitude && (
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">الموقع</h2>
              </CardHeader>
              <CardContent>
                <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    src={`https://www.google.com/maps?q=${restaurant.latitude},${restaurant.longitude}&output=embed`}
                    allowFullScreen
                  />
                </div>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${restaurant.latitude},${restaurant.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 text-primary hover:underline"
                >
                  <Icon name="Navigation" className="h-4 w-4" />
                  احصل على الاتجاهات
                </a>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper function to get service icon
function getServiceIcon(iconName: string): string {
  const icons: Record<string, string> = {
    'Wifi': '📶',
    'Car': '🚗',
    'Utensils': '🍽️',
    'Coffee': '☕',
    'Music': '🎵',
    'Tv': '📺',
    'Accessibility': '♿',
    'Baby': '👶',
    'Parking': '🅿️',
    'default': '✨',
  };
  return icons[iconName] || icons['default'];
}

