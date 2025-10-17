import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import Link from '@/components/link';
import { Icon } from '@/components/icons/Icon';
import db from '@/lib/prisma';

export const metadata = {
  title: 'بوابة المطعم',
  description: 'إدارة مطعمك',
};

export default async function RestaurantPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check authentication
  const session = await auth();

  if (!session || session.user.role !== 'RESTAURANT_OWNER') {
    redirect('/auth/login?error=unauthorized');
  }

  // Get restaurant for this owner
  const restaurant = await db.restaurant.findFirst({
    where: { userId: session.user.id },
    select: {
      id: true,
      name: true,
      slug: true,
      imageUrl: true,
      status: true,
    }
  });

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-4">
          <Icon name="Store" className="h-16 w-16 mx-auto text-muted-foreground" />
          <h1 className="text-2xl font-bold">لا يوجد مطعم مسجل</h1>
          <p className="text-muted-foreground">
            لم يتم تعيين مطعم لحسابك بعد. يرجى التواصل مع الإدارة.
          </p>
        </div>
      </div>
    );
  }

  if (restaurant.status === 'SUSPENDED') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-4">
          <Icon name="AlertTriangle" className="h-16 w-16 mx-auto text-destructive" />
          <h1 className="text-2xl font-bold">المطعم معلق</h1>
          <p className="text-muted-foreground">
            تم تعليق مطعمك مؤقتاً. يرجى التواصل مع الإدارة لمزيد من المعلومات.
          </p>
        </div>
      </div>
    );
  }

  const navItems = [
    { href: '/restaurant-portal', icon: 'LayoutDashboard', label: 'لوحة التحكم' },
    { href: '/restaurant-portal/profile', icon: 'Store', label: 'بيانات المطعم' },
    { href: '/restaurant-portal/menu', icon: 'UtensilsCrossed', label: 'القائمة' },
    { href: '/restaurant-portal/services', icon: 'Settings', label: 'الخدمات' },
    { href: '/restaurant-portal/features', icon: 'Star', label: 'المميزات' },
    { href: '/restaurant-portal/gallery', icon: 'Image', label: 'معرض الصور' },
    { href: '/restaurant-portal/orders', icon: 'Package', label: 'الطلبات' },
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            {restaurant.imageUrl && (
              <div className="relative w-10 h-10 rounded-lg overflow-hidden">
                <img src={restaurant.imageUrl} alt={restaurant.name} className="object-cover" />
              </div>
            )}
            <div>
              <h2 className="font-semibold">{restaurant.name}</h2>
              <p className="text-xs text-muted-foreground">بوابة المطعم</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/">
              <button className="text-sm flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted">
                <Icon name="Eye" className="h-4 w-4" />
                <span>عرض الواجهة</span>
              </button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container flex gap-6 py-6">
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0 space-y-2">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition"
              >
                <Icon name={item.icon as any} className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}





