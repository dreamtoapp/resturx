'use client';

import Link from '@/components/link';
import { Icon } from '@/components/icons/Icon';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface RestaurantPortalHeaderProps {
  restaurant: {
    name: string;
    slug: string;
    imageUrl: string | null;
    status: string;
  };
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function RestaurantPortalHeader({ restaurant, user }: RestaurantPortalHeaderProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-500/10 text-green-700 border-green-200';
      case 'INACTIVE':
        return 'bg-orange-500/10 text-orange-700 border-orange-200';
      case 'SUSPENDED':
        return 'bg-red-500/10 text-red-700 border-red-200';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'نشط';
      case 'INACTIVE':
        return 'غير نشط';
      case 'SUSPENDED':
        return 'معلق';
      default:
        return status;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 shadow-sm">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex h-16 lg:h-20 items-center justify-between gap-4">
          {/* Restaurant Info */}
          <div className="flex items-center gap-3 lg:gap-4 min-w-0 flex-1">
            {restaurant.imageUrl ? (
              <div className="relative w-12 h-12 lg:w-14 lg:h-14 rounded-xl overflow-hidden ring-2 ring-primary/10 flex-shrink-0 shadow-md">
                <Image
                  src={restaurant.imageUrl}
                  alt={restaurant.name}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
            ) : (
              <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0 shadow-md">
                <Icon name="Store" className="h-6 w-6 lg:h-7 lg:w-7 text-primary" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h1 className="font-bold text-base lg:text-lg truncate">{restaurant.name}</h1>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-xs text-muted-foreground">بوابة الإدارة</p>
                <Badge
                  variant="outline"
                  className={`text-xs px-2 py-0 ${getStatusColor(restaurant.status)}`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current ml-1.5 animate-pulse" />
                  {getStatusLabel(restaurant.status)}
                </Badge>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 lg:gap-3">
            {/* View Restaurant Page */}
            <Link href={`/restaurant/${restaurant.slug}`} target="_blank">
              <Button
                variant="outline"
                size="sm"
                className="hidden md:flex items-center gap-2 hover:bg-primary/5 hover:border-primary/50 transition-all"
              >
                <Icon name="Eye" className="h-4 w-4" />
                <span className="hidden lg:inline">عرض الصفحة</span>
              </Button>
            </Link>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <Icon name="Bell" className="h-5 w-5" />
                  <span className="absolute -top-1 -left-1 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full font-semibold">
                    3
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span>الإشعارات</span>
                  <Badge variant="secondary" className="text-xs">3 جديد</Badge>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="p-2 space-y-2">
                  <div className="p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                        <Icon name="MessageSquare" className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">تقييم جديد</p>
                        <p className="text-xs text-muted-foreground">عميل جديد قيّم مطعمك</p>
                        <p className="text-xs text-muted-foreground mt-1">منذ 5 دقائق</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                        <Icon name="Package" className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">طلب جديد</p>
                        <p className="text-xs text-muted-foreground">طلب #12345 في انتظار التأكيد</p>
                        <p className="text-xs text-muted-foreground mt-1">منذ 15 دقيقة</p>
                      </div>
                    </div>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="justify-center text-primary cursor-pointer">
                  <span>عرض جميع الإشعارات</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 ring-2 ring-primary/10">
                    <AvatarImage src={user.image || undefined} alt={user.name || 'User'} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-white font-semibold">
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold">{user.name || 'المستخدم'}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email || 'لا يوجد بريد إلكتروني'}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <Icon name="User" className="ml-2 h-4 w-4" />
                  <span>الملف الشخصي</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Icon name="Settings" className="ml-2 h-4 w-4" />
                  <span>الإعدادات</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Icon name="HelpCircle" className="ml-2 h-4 w-4" />
                  <span>المساعدة</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
                  <Icon name="LogOut" className="ml-2 h-4 w-4" />
                  <span>تسجيل الخروج</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}

