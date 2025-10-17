import Image from "next/image";
import { notFound } from "next/navigation";
import db from "@/lib/prisma";
import { PageProps } from "@/types/commonTypes";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

const getCountry = async (countryId: string) => {
  return await db.country.findUnique({
    where: { id: countryId },
    include: {
      translations: true,
      restaurants: {
        include: {
          services: true,
          _count: {
            select: {
              dishes: true,
            }
          }
        }
      }
    },
  });
};

export default async function CountryDetails({ params }: PageProps<{ id: string }>) {
  const { id } = await params;
  const country = await getCountry(id);
  if (!country) return notFound();

  return (
    <div dir="rtl" className="space-y-6 p-4">

      {/* بطاقة البلد/الجنسية */}
      <Card className="p-6 rounded-2xl shadow-md flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="relative w-32 h-32 rounded-md overflow-hidden border">
          <Image
            src={country.logo || "/placeholder.svg"}
            alt={country.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 space-y-2 text-center sm:text-right">
          <h2 className="text-2xl font-bold text-primary">{country.name}</h2>
          {country.description && (
            <p className="text-sm text-muted-foreground">{country.description}</p>
          )}
          <div className="text-sm space-y-1 text-muted-foreground">
            <p><strong>عدد المطاعم:</strong> {country.restaurants.length}</p>
          </div>
        </div>
      </Card>

      {/* المطاعم */}
      {country.restaurants && country.restaurants.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {country.restaurants.map((restaurant) => (
            <Card
              key={restaurant.id}
              className="relative overflow-hidden rounded-2xl shadow-md group transition-shadow hover:shadow-xl"
            >
              <div className="relative h-48">
                <Image
                  src={restaurant.imageUrl || restaurant.coverImage || "/placeholder.svg"}
                  alt={restaurant.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent z-10" />
                <div className="absolute top-3 right-3 z-20 flex flex-wrap gap-2">
                  {restaurant.isVerified && (
                    <Badge className="bg-green-500 text-white">✓ موثق</Badge>
                  )}
                  <Badge variant={restaurant.status === 'ACTIVE' ? 'default' : 'secondary'}>
                    {restaurant.status === 'ACTIVE' ? 'نشط' : restaurant.status === 'SUSPENDED' ? 'معلق' : 'غير نشط'}
                  </Badge>
                </div>
              </div>

              <div className="relative z-20 p-4 bg-background space-y-2">
                <h3 className="text-lg font-semibold text-foreground">{restaurant.name}</h3>
                {restaurant.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {restaurant.description}
                  </p>
                )}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {restaurant.phone && (
                    <span>📞 {restaurant.phone}</span>
                  )}
                  {restaurant.rating && (
                    <span>⭐ {restaurant.rating.toFixed(1)}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {restaurant._count.dishes} طبق
                  </Badge>
                  {restaurant.hasOwnDelivery && (
                    <Badge variant="outline" className="text-xs">توصيل خاص</Badge>
                  )}
                </div>
                {restaurant.services && restaurant.services.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-2">
                    {restaurant.services.slice(0, 3).map((service) => (
                      <span key={service.id} className="text-xs text-muted-foreground">
                        • {service.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Alert className="border border-border bg-muted/50 text-muted-foreground shadow-sm">
          <Info className="h-5 w-5" />
          <AlertTitle>لا توجد مطاعم</AlertTitle>
          <AlertDescription>
            لم يتم إضافة أي مطاعم لهذا البلد/الجنسية بعد.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
