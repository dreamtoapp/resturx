// NOTE: All icon values are string names. Use the global <Icon name={item.icon} /> component to render.

export async function getPendingOrdersCount(): Promise<number> {
  try {
    const { getOrderCounts } = await import('../management-orders/actions/get-order-counts');
    const orderCounts = await getOrderCounts();
    return orderCounts.pending;
  } catch (error) {
    console.error('Error fetching pending orders count:', error);
    return 0;
  }
}

export const navigationItems = [
  {
    label: 'الطلبات',
    href: '/dashboard/management-orders',
    icon: 'ClipboardList',
    children: [
      { label: 'جميع الطلبات', href: '/dashboard/management-orders', icon: 'ClipboardList' },
      { label: 'قيد المراجعة', href: '/dashboard/management-orders/status/pending', icon: 'Clock' },
      { label: 'مخصصة للسائقين', href: '/dashboard/management-orders/status/assigned', icon: 'UserCheck' },
      { label: 'قيد التوصيل', href: '/dashboard/management-orders/status/in-way', icon: 'Truck' },
      { label: 'مكتملة', href: '/dashboard/management-orders/status/delivered', icon: 'CheckCircle' },
      { label: 'ملغاة', href: '/dashboard/management-orders/status/canceled', icon: 'XCircle' },
      { label: 'تحليلات الطلبات', href: '/dashboard/management-orders/analytics', icon: 'Activity' }
    ]
  },
  {
    label: 'القائمة والمنتجات',
    href: '/dashboard/management-products',
    icon: 'UtensilsCrossed',
    children: [
      { label: 'الأطباق', href: '/dashboard/management-products', icon: 'UtensilsCrossed' },
      { label: 'المطاعم', href: '/dashboard/management-categories', icon: 'Store' },
      { label: 'أنواع المطابخ', href: '/dashboard/management-Cuisine', icon: 'ChefHat' },
      {
        label: 'العروض',
        href: '/dashboard/management-offer',
        icon: 'Megaphone',
        children: [
          { label: 'إنشاء عرض', href: '/dashboard/management-offer/new', icon: 'PlusCircle', key: 'offer-new' },
          { label: 'عروض المنتجات', href: '/dashboard/management-offer?type=product', icon: 'Tag', key: 'offer-product' },
          { label: 'جميع العروض', href: '/dashboard/management-offer?type=all', icon: 'Megaphone', key: 'offer-all' }
        ]
      }
    ]
  },
  {
    label: 'العملاء',
    href: '/dashboard/management-users/customer',
    icon: 'Users',
    children: [
      { label: 'العملاء', href: '/dashboard/management-users/customer', icon: 'Users' },
      { label: 'الدعم', href: '/dashboard/management/client-submission', icon: 'Headset' }
    ]
  },
  {
    label: 'الفريق',
    href: '/dashboard/management-users/drivers',
    icon: 'Truck',
    children: [
      { label: 'المشرفون', href: '/dashboard/management-users/admin', icon: 'Shield' },
      { label: 'السائقون', href: '/dashboard/management-users/drivers', icon: 'Truck' }
    ]
  },

  // {
  //   label: 'المالية',
  //   href: '/dashboard/management-expenses',
  //   icon: 'DollarSign',
  //   children: [
  //     { label: 'المصروفات', href: '/dashboard/management-expenses', icon: 'DollarSign' },
  //     { label: 'الإيرادات', href: '/dashboard/management-expenses/revenue', icon: 'TrendingUp' },
  //     { label: 'التقارير المالية', href: '/dashboard/management-expenses/reports', icon: 'BarChart3' }
  //   ]
  // },
  {
    label: 'التقارير',
    href: '/dashboard/management-reports',
    icon: 'BarChart3',
    children: [
      { label: '📊 المبيعات والربحية', href: '', icon: 'TrendingUp', key: 'category-header-1' },
      { label: 'تقرير المبيعات', href: '/dashboard/management-reports/sales', icon: 'TrendingUp' },
      { label: 'التقارير المالية', href: '/dashboard/management-reports/finance', icon: 'DollarSign' },
      { label: 'أداء المنتجات', href: '/dashboard/management-reports/product-performance', icon: 'BarChart2' },

      { label: '---', href: '', icon: 'Minus', key: 'separator-1' },

      { label: '📋 العمليات والمخزون', href: '', icon: 'ClipboardList', key: 'category-header-2' },
      { label: 'تحليلات الطلبات', href: '/dashboard/management-reports/orders', icon: 'Activity' },
      { label: 'تقرير المخزون', href: '/dashboard/management-reports/inventory', icon: 'ClipboardList' },
      { label: 'تقرير السائقين والتوصيل', href: '/dashboard/management-reports/drivers', icon: 'Truck' },

      { label: '---', href: '', icon: 'Minus', key: 'separator-2' },

      { label: '👥 العملاء والتسويق', href: '', icon: 'UserCheck', key: 'category-header-3' },
      { label: 'تقرير العملاء', href: '/dashboard/management-reports/customers', icon: 'UserCheck' },
      { label: 'تقرير العروض والتخفيضات', href: '/dashboard/management-reports/promotions', icon: 'Gift' },
      { label: 'تقرير التقييمات والمراجعات', href: '/dashboard/management-reports/reviews', icon: 'Star' },

      { label: '---', href: '', icon: 'Minus', key: 'separator-3' },

      { label: '🏆 الإنجازات والأرقام', href: '', icon: 'Award', key: 'category-header-4' },
      { label: 'الإنجازات والأرقام القياسية', href: '/dashboard/management-reports/milestones', icon: 'Award' }
    ]
  },
  {
    label: ' المتجر',
    href: '/dashboard/management/settings/company-profile',
    icon: 'Building2',
    children: [
      { label: 'من نحن', href: '/dashboard/management/about', icon: 'Info' },
      { label: 'المناوبات', href: '/dashboard/management/shifts', icon: 'Clock' },
      { label: 'سياسة الموقع', href: '/dashboard/management/policies/website', icon: 'Globe' },
      { label: 'سياسة الإرجاع', href: '/dashboard/management/policies/return', icon: 'Undo' },
      { label: 'سياسة الخصوصية', href: '/dashboard/management/policies/privacy', icon: 'Shield' },
      { label: 'سياسة الشحن', href: '/dashboard/management/policies/shipping', icon: 'Truck' },
      { label: 'دليل الاستخدام', href: '/dashboard/management/guidelines', icon: 'BookOpen' },
      { label: 'صحة المتجر', href: '/dashboard/management/health-status', icon: 'Activity' }
    ]
  },


  {
    label: 'إعدادات المنصة',
    href: '/dashboard/management/settings/platform',
    icon: 'Settings',
    iconOnly: true,
    children: [
      { label: 'إعدادات متقدمة', href: '/dashboard/management/settings/advanced', icon: 'Wrench' },
      { label: 'System Log', href: '/dashboard/management/settings/errors', icon: 'Bug' },
      { label: 'تحسين المحركات', href: '/dashboard/management-seo', icon: 'Search' },
      { label: 'الصيانة', href: '/dashboard/management-maintinance', icon: 'Wrench' }
    ]
  }
];

export type NavigationItem = {
  label: string;
  href?: string;
  icon?: string;
  badge?: string;
  key?: string;
  iconOnly?: boolean;
  children?: NavigationItem[];
};