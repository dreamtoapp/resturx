import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Icon } from '@/components/icons/Icon';
import WhatsAppButton from '@/components/WhatsAppButton';
import WhatsAppIcon from '@/components/icons/WhatsAppIcon';

interface RestaurantInfoTabProps {
  restaurant: {
    name: string;
    phone?: string | null;
    whatsapp?: string | null;
    email?: string | null;
    address?: string | null;
    workingHours?: string | null;
    latitude?: string | null;
    longitude?: string | null;
  };
}

export default function RestaurantInfoTab({ restaurant }: RestaurantInfoTabProps) {
  return (
    <div className="space-y-6">
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
          {restaurant.whatsapp && (
            <div className="flex items-center gap-3">
              <WhatsAppIcon size={20} className="text-green-600 flex-shrink-0" />
              <WhatsAppButton
                phone={restaurant.whatsapp}
                defaultMessage={`مرحباً! أود الاستفسار عن ${restaurant.name}`}
                buttonVariant="link"
                className="p-0 h-auto hover:underline text-foreground"
              >
                {restaurant.whatsapp} (واتساب)
              </WhatsAppButton>
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
    </div>
  );
}

