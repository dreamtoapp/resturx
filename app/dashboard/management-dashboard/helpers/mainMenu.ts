// NOTE: All icon values are now string names. Use the global <Icon name={item.icon} /> component to render.

export const menuGroups = [
  {
    label: 'الرئيسية',
    items: [
      { title: 'لوحة التحكم', url: '/dashboard', icon: 'LayoutDashboard' },
      { title: 'المتجر', url: '/', icon: 'Store' },
    ],
  },
  {
    label: 'الطلبات',
    items: [
      { title: 'جميع الطلبات', url: '/dashboard/management-orders', icon: 'ClipboardList' },
      { title: 'قيد المراجعة', url: '/dashboard/management-orders/status/pending', icon: 'Clock' },
      { title: 'مخصصة للسائقين', url: '/dashboard/management-orders/status/assigned', icon: 'UserCheck' },
      { title: 'قيد التوصيل', url: '/dashboard/management-orders/status/in-way', icon: 'Truck' },
      { title: 'مكتملة', url: '/dashboard/management-orders/status/delivered', icon: 'CheckCircle' },
      { title: 'ملغاة', url: '/dashboard/management-orders/status/canceled', icon: 'XCircle' },
      { title: 'تحليلات الطلبات', url: '/dashboard/management-orders/analytics', icon: 'Activity' },
    ],
  },
  {
    label: 'القائمة والمنتجات',
    items: [
      { title: 'الأطباق', url: '/dashboard/management-products', icon: 'UtensilsCrossed' },
      { title: 'المطاعم', url: '/dashboard/management-categories', icon: 'Store' },
      { title: 'أنواع المطابخ', url: '/dashboard/management-Cuisine', icon: 'ChefHat' },
      // نقل "العروض" إلى مجموعة المنتجات
      {
        title: 'العروض',
        url: '/dashboard/management-offer',
        icon: 'Tag',
        // قائمة فرعية أفضل تجربة استخدام
        children: [
          { title: 'إنشاء عرض', url: '/dashboard/management-offer/new', icon: 'PlusCircle', key: 'offer-new' },
          { title: 'عروض المنتجات', url: '/dashboard/management-offer?type=product', icon: 'Tag', key: 'offer-product' },
          { title: 'جميع العروض', url: '/dashboard/management-offer?type=all', icon: 'Megaphone', key: 'offer-all' },
        ],
      },
    ],
  },
  {
    label: 'العملاء',
    items: [
      { title: 'العملاء', url: '/dashboard/management-users/customer', icon: 'Users' },
      { title: 'الدعم', url: '/dashboard/management/client-submission', icon: 'Headset' },
    ],
  },
  {
    label: 'الفريق',
    items: [
      { title: 'المشرفون', url: '/dashboard/management-users/admin', icon: 'ShieldCheck' },
      { title: 'التسويق', url: '/dashboard/management-users/marketer', icon: 'Megaphone' },
      { title: 'السائقون', url: '/dashboard/management-users/drivers', icon: 'Truck' },
      { title: 'المناوبات', url: '/dashboard/management/shifts', icon: 'CalendarClock' },
    ],
  },
  {
    label: 'التسويق',
    items: [
      { title: 'البريد الإلكتروني', url: '/dashboard/management/client-news', icon: 'Mailbox' },
    ],
  },
  {
    label: 'التقارير',
    items: [
      { title: 'التقارير', url: '/dashboard/management-reports', icon: 'Activity' },
    ],
  },
  {
    label: 'المالية',
    items: [
      { title: 'المصروفات', url: '/dashboard/management-expenses', icon: 'CreditCard' },
    ],
  },
  {
    label: 'الإعدادات',
    items: [
      { title: 'الإعدادات', url: '/dashboard/management/settings', icon: 'Settings' },
      { title: 'التنبيهات', url: '/dashboard/management-notification', icon: 'Bell' },
      { title: 'الصيانة', url: '/dashboard/management-maintinance', icon: 'LifeBuoy' },
      { title: 'الدليل', url: '/dashboard/guidelines', icon: 'BookOpen' },
      { title: 'البيانات', url: '/dashboard/dataSeed', icon: 'Database' },
      { title: 'من نحن', url: '/dashboard/management/about', icon: 'Info' },
    ],
  },
  {
    label: 'تحسين المحركات',
    items: [
      { title: 'تحليل SEO', url: '/dashboard/management-seo', icon: 'SearchCheck' },
      { title: 'الصفحة الرئيسية', url: '/dashboard/management-seo/home', icon: 'Home' },
      { title: 'من نحن', url: '/dashboard/management-seo/about', icon: 'Info' },
      { title: 'المدونة', url: '/dashboard/management-seo/blog', icon: 'Newspaper' },
      { title: 'صفحات المنتجات', url: '/dashboard/management-seo/product', icon: 'Package' },
      // { title: 'الترويج', url: '/dashboard/management-seo/promotion', icon: 'Tag' }, // No directory found
      { title: 'التصنيفات', url: '/dashboard/management-seo/category', icon: 'LayoutGrid' },
      { title: 'الأداء', url: '/dashboard/management-seo/performance', icon: 'Gauge' },
    ],
  },
];