'use client';

import { usePathname } from 'next/navigation';
import Link from '@/components/link';
import { Icon } from '@/components/icons/Icon';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface RestaurantPortalSidebarProps {
  restaurant: {
    name: string;
    slug: string;
  };
  dishesCount?: number;
  servicesCount?: number;
  featuresCount?: number;
  imagesCount?: number;
  videosCount?: number;
  pendingOrdersCount?: number;
  reviewsCount?: number;
  todayOrdersCount?: number;
  rating?: number;
}

interface NavItem {
  href: string;
  icon: string;
  label: string;
  exact?: boolean;
  badge?: string;
  badgeVariant?: 'default' | 'secondary' | 'outline' | 'destructive';
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

export default function RestaurantPortalSidebar({
  restaurant,
  dishesCount = 0,
  servicesCount = 0,
  featuresCount = 0,
  imagesCount = 0,
  videosCount = 0,
  pendingOrdersCount = 0,
  reviewsCount = 0,
  todayOrdersCount = 0,
  rating = 0
}: RestaurantPortalSidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navGroups: NavGroup[] = [
    {
      label: 'الرئيسية',
      items: [
        {
          href: '/restaurant-portal',
          icon: 'LayoutDashboard',
          label: 'لوحة التحكم',
          exact: true
        },
      ]
    },
    {
      label: 'إدارة المطعم',
      items: [
        { href: '/restaurant-portal/profile', icon: 'Store', label: 'بيانات المطعم' },
        {
          href: '/restaurant-portal/menu',
          icon: 'UtensilsCrossed',
          label: 'قائمة الطعام',
          badge: dishesCount > 0 ? String(dishesCount) : undefined,
          badgeVariant: 'secondary' as const
        },
        {
          href: '/restaurant-portal/tables',
          icon: 'LayoutGrid',
          label: 'إدارة الطاولات',
          badgeVariant: 'secondary' as const
        },
        {
          href: '/restaurant-portal/orders',
          icon: 'ClipboardList',
          label: 'الطلبات',
          badgeVariant: 'secondary' as const
        },
        {
          href: '/restaurant-portal/services',
          icon: 'Settings',
          label: 'الخدمات',
          badge: servicesCount > 0 ? String(servicesCount) : undefined,
          badgeVariant: 'secondary' as const
        },
        {
          href: '/restaurant-portal/features',
          icon: 'Star',
          label: 'المميزات',
          badge: featuresCount > 0 ? String(featuresCount) : undefined,
          badgeVariant: 'secondary' as const
        },
        {
          href: '/restaurant-portal/gallery',
          icon: 'Grid3X3',
          label: 'معرض الصور',
          badge: imagesCount > 0 ? String(imagesCount) : undefined,
          badgeVariant: 'secondary' as const
        },
        {
          href: '/restaurant-portal/videos',
          icon: 'Video',
          label: 'الفيديوهات',
          badge: videosCount > 0 ? String(videosCount) : undefined,
          badgeVariant: 'secondary' as const
        },
        {
          href: '/restaurant-portal/qr-code',
          icon: 'QrCode',
          label: 'رمز QR'
        },
      ]
    },
    {
      label: 'التفاعل',
      items: [
        {
          href: '/restaurant-portal/orders',
          icon: 'Package',
          label: 'الطلبات',
          badge: pendingOrdersCount > 0 ? String(pendingOrdersCount) : undefined,
          badgeVariant: 'default' as const
        },
        {
          href: '/restaurant-portal/reviews',
          icon: 'MessageSquare',
          label: 'التقييمات',
          badge: reviewsCount > 0 ? String(reviewsCount) : undefined,
          badgeVariant: 'secondary' as const
        },
      ]
    },
    {
      label: 'المحتوى',
      items: [
        { href: '/restaurant-portal/blog', icon: 'FileText', label: 'المدونة' },
        { href: '/restaurant-portal/social-media', icon: 'Share2', label: 'وسائل التواصل' },
      ]
    }
  ];

  const isActive = (href: string, exact?: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        "sticky top-20 h-[calc(100vh-5rem)] border-l bg-card/50 backdrop-blur-sm transition-all duration-300 overflow-y-auto",
        isCollapsed ? "w-20" : "w-72"
      )}
    >
      {/* Collapse Toggle */}
      <div className="p-4 border-b flex items-center justify-between">
        {!isCollapsed && (
          <h3 className="font-semibold text-sm text-muted-foreground">القائمة الرئيسية</h3>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-muted rounded-lg transition-colors ml-auto"
        >
          <Icon name={isCollapsed ? "ChevronLeft" : "ChevronRight"} className="h-4 w-4" />
        </button>
      </div>

      <nav className="p-3 space-y-6">
        {navGroups.map((group, groupIndex) => (
          <div key={groupIndex}>
            {!isCollapsed && (
              <h4 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {group.label}
              </h4>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const active = isActive(item.href, item.exact);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                      active
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                        : "hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {/* Active Indicator */}
                    {active && (
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-foreground rounded-l-full" />
                    )}

                    <Icon
                      name={item.icon as any}
                      className={cn(
                        "h-5 w-5 transition-transform group-hover:scale-110",
                        active ? "text-primary-foreground" : ""
                      )}
                    />

                    {!isCollapsed && (
                      <>
                        <span className="flex-1 font-medium text-sm">{item.label}</span>
                        {item.badge && (
                          <Badge
                            variant={item.badgeVariant || 'default'}
                            className={cn(
                              "text-xs px-2 py-0 min-w-[1.5rem] justify-center",
                              active && "bg-primary-foreground text-primary"
                            )}
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </>
                    )}

                    {/* Tooltip for collapsed state */}
                    {isCollapsed && (
                      <div className="absolute right-full mr-2 px-3 py-2 bg-popover text-popover-foreground text-sm rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 border">
                        {item.label}
                        {item.badge && (
                          <Badge variant={item.badgeVariant || 'default'} className="ml-2 text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Quick Stats - Bottom */}
      {!isCollapsed && (
        <div className="p-4 mt-auto border-t">
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-blue-700 dark:text-blue-300">إحصائيات اليوم</span>
                <Icon name="TrendingUp" className="h-3 w-3 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div>
                  <p className="text-lg font-bold text-blue-900 dark:text-blue-100">{todayOrdersCount}</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">طلب</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-blue-900 dark:text-blue-100">{rating.toFixed(1)}</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">تقييم</p>
                </div>
              </div>
            </div>

            <Link
              href={`/restaurant/${restaurant.slug}`}
              target="_blank"
              className="flex items-center justify-center gap-2 p-2.5 rounded-lg border border-dashed border-muted-foreground/30 hover:border-primary hover:bg-primary/5 transition-all group text-sm"
            >
              <Icon name="Eye" className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="text-muted-foreground group-hover:text-primary transition-colors font-medium">
                معاينة صفحة المطعم
              </span>
            </Link>
          </div>
        </div>
      )}
    </aside>
  );
}

