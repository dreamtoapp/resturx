import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Icon } from '@/components/icons/Icon';
import Image from 'next/image';

interface RestaurantOverviewTabProps {
  restaurant: {
    bio?: string | null;
    specialties?: string[];
    services?: Array<{
      id: string;
      masterService: {
        name: string;
        imageUrl?: string | null;
        description?: string | null;
      };
    }>;
    features?: Array<{
      id: string;
      masterFeature: {
        title: string;
        imageUrl?: string | null;
        description: string;
      };
    }>;
    deliveryTime?: string | null;
    minOrder?: number | null;
    deliveryFee?: number | null;
    hasOwnDelivery?: boolean;
    paymentMethods?: string[];
  };
}

export default function RestaurantOverviewTab({ restaurant }: RestaurantOverviewTabProps) {
  return (
    <div className="space-y-6">
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
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                    {service.masterService.imageUrl ? (
                      <Image
                        src={service.masterService.imageUrl}
                        alt={service.masterService.name}
                        width={24}
                        height={24}
                        className="object-contain"
                      />
                    ) : (
                      <Icon name="CheckCircle2" className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{service.masterService.name}</p>
                    {service.masterService.description && (
                      <p className="text-xs text-muted-foreground">{service.masterService.description}</p>
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
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                      {feature.masterFeature.imageUrl ? (
                        <Image
                          src={feature.masterFeature.imageUrl}
                          alt={feature.masterFeature.title}
                          width={28}
                          height={28}
                          className="object-contain"
                        />
                      ) : (
                        <Icon name="Star" className="w-6 h-6 text-primary" />
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.masterFeature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.masterFeature.description}</p>
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
    </div>
  );
}

