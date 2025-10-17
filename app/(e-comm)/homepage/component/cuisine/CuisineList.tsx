import Image from 'next/image';
import Link from '@/components/link';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Icon } from '@/components/icons/Icon';
import { getCategories } from '../../actions/getCategories';

// Cuisine Header Component - Modern design with gradient accent
function CuisineHeader({ cuisinesCount }: { cuisinesCount: number }) {
  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 pb-6 md:pb-8">
      <div className="space-y-2 flex-1">
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            تصفح حسب نوع المطبخ
          </h2>
          {/* <Badge
            variant="secondary"
            className="h-7 px-3 text-xs font-bold bg-gradient-to-br from-primary/20 to-primary/10 text-primary border border-primary/20 shadow-sm"
          >
            {cuisinesCount}
          </Badge> */}
        </div>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl">
          اكتشف مطاعم متنوعة من مختلف أنحاء العالم
        </p>
      </div>
      {cuisinesCount > 0 && (
        <Link
          href="/cuisines"
          className="relative flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary via-primary to-primary/90 text-primary-foreground hover:from-primary/90 hover:via-primary/85 hover:to-primary/80 transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:scale-105 group min-h-[44px] sm:min-h-0 font-bold text-sm sm:text-base border border-primary-foreground/20"
          aria-label={`عرض جميع المطابخ (${cuisinesCount})`}
        >
          <Icon name="Flame" className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
          <span>استكشف المزيد</span>
          <div className="flex items-center gap-1.5">
            <div className="h-4 w-px bg-primary-foreground/30" />
            <span className="flex h-6 min-w-6 px-1.5 items-center justify-center rounded-md bg-primary-foreground/20 backdrop-blur-sm text-primary-foreground text-xs font-bold">
              {cuisinesCount}
            </span>
          </div>
          <Icon name="ArrowLeft" className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
        </Link>
      )}
    </header>
  );
}

// Cuisine Card Component - Enhanced with modern design and better UX
function CuisineCard({ cuisine, index }: { cuisine: any; index: number }) {
  const hasMultipleActions = [
    true, // Restaurant count always visible
    cuisine.hasArticle,
    cuisine.popularDishesCount > 0
  ].filter(Boolean).length;

  return (
    <li
      key={cuisine.id}
      className="snap-center shrink-0 w-[240px] sm:w-[260px] md:w-[280px] group"
    >
      <Card className="h-full border border-border/60 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 overflow-hidden backdrop-blur-sm bg-card/80">
        <CardContent className="p-0">
          {/* Main Link - Image & Title */}
          <Link
            href={`/cuisines/${cuisine.slug}`}
            className="block relative"
            aria-label={`عرض مطاعم ${cuisine.name}`}
          >
            {/* Image Container with Overlay */}
            <div className="relative h-40 sm:h-44 md:h-48 w-full overflow-hidden bg-gradient-to-br from-muted/90 via-muted/70 to-muted/90">
              {cuisine.imageUrl ? (
                <>
                  <Image
                    src={cuisine.imageUrl}
                    alt={`علم ${cuisine.name}`}
                    fill
                    sizes="(max-width: 640px) 240px, (max-width: 768px) 260px, 280px"
                    className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                    priority={index < 4}
                  />
                  {/* Modern gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                </>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-muted via-muted/90 to-muted flex items-center justify-center">
                  <Icon name="Globe" className="h-16 w-16 text-muted-foreground/40" />
                </div>
              )}

              {/* Cuisine Name Overlay with modern styling */}
              <div className="absolute bottom-0 left-0 right-0 p-3 pb-2.5 bg-gradient-to-t from-background/50 to-transparent backdrop-blur-[2px]">
                <h3 className="text-lg sm:text-xl font-bold text-foreground drop-shadow-md text-center tracking-tight">
                  {cuisine.name}
                </h3>
              </div>

              {/* Restaurant Count Badge - Enhanced with vibrant colors */}
              <div className="absolute top-3 right-3">
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-br from-primary/95 to-primary/85 backdrop-blur-md border border-primary-foreground/20 shadow-lg hover:shadow-xl hover:shadow-primary/30 hover:scale-105 transition-all duration-200">
                  <div className="flex items-center justify-center w-6 h-6 rounded-md bg-primary-foreground/20">
                    <Icon name="Store" className="h-3.5 w-3.5 text-primary-foreground" />
                  </div>
                  <span className="text-xs font-bold text-primary-foreground">
                    {cuisine.restaurantCount}
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Action Buttons Section - Modern glass morphism */}
          {hasMultipleActions > 1 && (
            <div className="p-2.5 flex items-center justify-center gap-2 bg-gradient-to-r from-muted/40 via-muted/30 to-muted/40 backdrop-blur-sm border-t border-border/40">
              {/* Article Icon Button */}
              {cuisine.hasArticle && (
                <Link
                  href={`/cuisine/${cuisine.slug}/article`}
                  className="flex-1"
                  aria-label={`قراءة مقالة عن ${cuisine.name}`}
                >
                  <div className="w-full min-h-[44px] flex items-center justify-center rounded-xl bg-gradient-to-br from-accent/15 to-accent/5 hover:from-accent/25 hover:to-accent/10 border border-accent/40 hover:border-accent/60 transition-all duration-300 group/btn shadow-sm hover:shadow-md">
                    <Icon name="BookOpen" className="h-5 w-5 text-accent-foreground transition-transform duration-300 group-hover/btn:scale-125" />
                  </div>
                </Link>
              )}

              {/* Popular Dishes Icon Button with Counter */}
              {cuisine.popularDishesCount > 0 && (
                <Link
                  href={`/cuisine/${cuisine.slug}/popular-dishes`}
                  className="flex-1"
                  aria-label={`عرض ${cuisine.popularDishesCount} أطباق مشهورة من ${cuisine.name}`}
                >
                  <div className="relative w-full min-h-[44px] flex items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 hover:from-primary/25 hover:to-primary/10 border border-primary/40 hover:border-primary/60 transition-all duration-300 group/btn shadow-sm hover:shadow-md">
                    <Icon name="UtensilsCrossed" className="h-5 w-5 text-primary transition-transform duration-300 group-hover/btn:scale-125" />
                    {/* Counter Badge - Inside button */}
                    <span className="absolute top-1 right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-primary text-primary-foreground text-[9px] font-bold shadow-sm">
                      {cuisine.popularDishesCount}
                    </span>
                  </div>
                </Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </li>
  );
}

// Empty State Component - Enhanced with better visual design
function EmptyState() {
  return (
    <div className="py-16 sm:py-20 px-6 text-center">
      {/* Animated Icon Container */}
      <div className="relative mx-auto w-28 h-28 sm:w-32 sm:h-32 mb-8">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 via-primary/10 to-transparent animate-pulse" />
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center backdrop-blur-sm">
          <Icon name="Globe" className="w-14 h-14 sm:w-16 sm:h-16 text-primary/70" />
        </div>
      </div>

      {/* Text Content */}
      <div className="space-y-4 max-w-lg mx-auto">
        <h3 className="text-xl sm:text-2xl font-bold text-foreground">
          لا توجد مطابخ متاحة حالياً
        </h3>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          نحن نعمل على إضافة مطاعم متنوعة من جنسيات مختلفة. ستعود قريباً مع تشكيلة واسعة من المطاعم المميزة.
        </p>
      </div>

      {/* Decorative Elements */}
      <div className="mt-8 flex justify-center gap-2">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-primary/30"
            style={{
              animation: `pulse 1.5s infinite`,
              animationDelay: `${i * 0.2}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Main Cuisine List Component - Enhanced with better mobile scrolling
export default async function CuisineList() {
  const cuisines = await getCategories();

  return (
    <section
      className="mx-auto w-full space-y-4 md:space-y-6"
      aria-label="قسم تصفح المطابخ"
    >
      <CuisineHeader cuisinesCount={cuisines.length} />

      {cuisines.length > 0 ? (
        <div className="space-y-3">
          <div className="relative -mx-4 sm:mx-0">
            {/* Gradient Fade on edges for better scroll indication */}
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-r from-background to-transparent z-10" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-l from-background to-transparent z-10" />

            <ScrollArea className="w-full">
              <nav aria-label="قائمة المطابخ" className="px-4 sm:px-0">
                <ul className="flex gap-4 sm:gap-5 md:gap-6 pb-4 snap-x snap-mandatory overflow-x-auto scrollbar-hide">
                  {cuisines.map((cuisine, idx) => (
                    <CuisineCard key={cuisine.id} cuisine={cuisine} index={idx} />
                  ))}
                </ul>
              </nav>
              <ScrollBar
                orientation="horizontal"
                className="h-2.5 sm:h-3 bg-muted/30 rounded-full [&>div]:bg-primary/60 [&>div]:rounded-full hover:[&>div]:bg-primary transition-colors"
              />
            </ScrollArea>
          </div>

          {/* Scroll Hint - Below the section with animated arrows */}
          {cuisines.length > 2 && (
            <div className="flex justify-center">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/80 backdrop-blur-sm text-muted-foreground text-xs sm:text-sm">
                {/* Right animated arrows */}
                <div className="relative flex">
                  <Icon name="ChevronRight" className="h-4 w-4 sm:h-5 sm:w-5 animate-pulse" />
                  <Icon name="ChevronRight" className="h-4 w-4 sm:h-5 sm:w-5 -ml-2 animate-pulse opacity-60" style={{ animationDelay: '0.15s' }} />
                </div>
                <span className="font-medium">اسحب للمزيد</span>
                {/* Left animated arrows */}
                <div className="relative flex">
                  <Icon name="ChevronLeft" className="h-4 w-4 sm:h-5 sm:w-5 -mr-2 animate-pulse opacity-60" style={{ animationDelay: '0.15s' }} />
                  <Icon name="ChevronLeft" className="h-4 w-4 sm:h-5 sm:w-5 animate-pulse" />
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Card className="border-2 border-dashed">
          <CardContent className="p-0">
            <EmptyState />
          </CardContent>
        </Card>
      )}
    </section>
  );
}

