# StickyBreadcrumb Usage Examples

This document provides real-world examples of how to implement breadcrumbs across different page types in the application.

## Example 1: Cuisine Listing Page (Currently Implemented)

**File**: `app/(e-comm)/(home-page-sections)/cuisines/page.tsx`

```tsx
import StickyBreadcrumb from '@/components/StickyBreadcrumb';

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen">
      <StickyBreadcrumb
        items={[
          { label: 'الرئيسية', href: '/' },
          { label: 'المطابخ' }
        ]}
      />

      <div className="container mx-auto py-8 px-4">
        {/* Page content */}
      </div>
    </div>
  );
}
```

---

## Example 2: Individual Cuisine Detail Page

**File**: `app/(e-comm)/cuisines/[slug]/page.tsx`

```tsx
import StickyBreadcrumb from '@/components/StickyBreadcrumb';

export default async function CuisineDetailPage({ params }) {
  const { slug } = await params;
  const cuisine = await getCuisine(slug);

  return (
    <div className="min-h-screen">
      <StickyBreadcrumb
        items={[
          { label: 'الرئيسية', href: '/' },
          { label: 'المطابخ', href: '/cuisines' },
          { label: cuisine.name }
        ]}
      />

      <div className="container mx-auto py-8 px-4">
        {/* Cuisine details and restaurant list */}
      </div>
    </div>
  );
}
```

---

## Example 3: Restaurant Profile Page

**File**: `app/(e-comm)/restaurant/[slug]/page.tsx`

```tsx
import StickyBreadcrumb from '@/components/StickyBreadcrumb';

export default async function RestaurantProfilePage({ params }) {
  const { slug } = await params;
  const restaurant = await getRestaurant(slug);

  return (
    <>
      <StickyBreadcrumb
        items={[
          { label: 'الرئيسية', href: '/' },
          { label: 'المطاعم', href: '/restaurants' },
          { label: restaurant.name }
        ]}
      />

      <div className="container mx-auto py-8">
        {/* Restaurant profile content */}
      </div>
    </>
  );
}
```

---

## Example 4: Restaurant Menu Page (Nested Route)

**File**: `app/(e-comm)/restaurant/[slug]/menu/page.tsx`

```tsx
import StickyBreadcrumb from '@/components/StickyBreadcrumb';

export default async function RestaurantMenuPage({ params }) {
  const { slug } = await params;
  const restaurant = await getRestaurant(slug);

  return (
    <>
      <StickyBreadcrumb
        items={[
          { label: 'الرئيسية', href: '/' },
          { label: 'المطاعم', href: '/restaurants' },
          { label: restaurant.name, href: `/restaurant/${slug}` },
          { label: 'القائمة' }
        ]}
      />

      <div className="container mx-auto py-8">
        {/* Menu items */}
      </div>
    </>
  );
}
```

---

## Example 5: Product Detail Page with Dynamic Category

**File**: `app/(e-comm)/(home-page-sections)/product/[slug]/page.tsx`

```tsx
import StickyBreadcrumb from '@/components/StickyBreadcrumb';

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  
  // Build breadcrumb items dynamically
  const breadcrumbItems = [
    { label: 'الرئيسية', href: '/' },
  ];

  // Add category if available
  if (product.categorySlug) {
    breadcrumbItems.push({
      label: product.categoryName,
      href: `/categories/${product.categorySlug}`
    });
  }

  // Add current product (no href = current page)
  breadcrumbItems.push({
    label: product.name
  });

  return (
    <>
      <StickyBreadcrumb items={breadcrumbItems} />

      <div className="container mx-auto px-4 py-8">
        {/* Product details */}
      </div>
    </>
  );
}
```

---

## Example 6: With Icons

```tsx
import StickyBreadcrumb from '@/components/StickyBreadcrumb';

export default async function Page() {
  return (
    <>
      <StickyBreadcrumb
        items={[
          { label: 'الرئيسية', href: '/', icon: 'Home' },
          { label: 'المطابخ', href: '/cuisines', icon: 'UtensilsCrossed' },
          { label: 'إيطالي', icon: 'ChefHat' }
        ]}
      />

      <div className="container mx-auto py-12 px-4">
        {/* Content */}
      </div>
    </>
  );
}
```

---

## Important Notes

### ✅ DO's
- Place `StickyBreadcrumb` at the top of your page component
- Wrap entire page in a container div (e.g., `<div className="min-h-screen">`)
- Last breadcrumb item should **not** have `href` (represents current page)
- Use clear, concise Arabic labels
- Keep breadcrumb hierarchy shallow (max 4 levels recommended)
- Test sticky behavior by scrolling up and down

### ❌ DON'Ts
- Don't place breadcrumb inside the main content container
- Don't add href to the last/current page item
- Don't create deep breadcrumb hierarchies (> 4 levels)
- Don't use breadcrumbs on the homepage
- Don't forget to await params in async components
- Don't use negative margin hacks (component handles positioning cleanly)

---

## Layout Integration Pattern

The breadcrumb works with the current layout structure using clean sticky positioning:

```
Layout (app/(e-comm)/layout.tsx)
├── HeaderUnified (fixed: top-0, h-14/h-16)
├── FilterAlert
├── CustomMobileBottomNav
└── main (pt-16 sm:pt-18 md:pt-20)
    └── container
        └── {children}
            └── Your Page Component
                ├── StickyBreadcrumb (sticky: top-14/top-16) ← Always visible
                └── Page content
```

**UX Best Practice**: The breadcrumb uses clean `position: sticky` without negative margin tricks, ensuring it's always visible during scroll up and down for constant navigation context.

---

## Migration Guide for Existing Pages

If you have existing inline breadcrumb code, here's how to migrate:

**Before:**
```tsx
<nav className="flex items-center gap-2 mb-4">
  <Link href="/">الرئيسية</Link>
  <ChevronRight />
  <span>الصفحة الحالية</span>
</nav>
```

**After:**
```tsx
import StickyBreadcrumb from '@/components/StickyBreadcrumb';

<StickyBreadcrumb
  items={[
    { label: 'الرئيسية', href: '/' },
    { label: 'الصفحة الحالية' }
  ]}
/>
```

---

## Testing Checklist

When implementing breadcrumbs on a new page:

- [ ] Breadcrumb sticks below header when scrolling
- [ ] All links work correctly
- [ ] Current page (last item) is not a link
- [ ] Responsive on mobile (readable, touch targets adequate)
- [ ] RTL text displays correctly
- [ ] No layout shifts or content jumps
- [ ] Backdrop blur effect visible when scrolling over content
- [ ] Accessible via keyboard navigation
- [ ] Screen reader announces navigation correctly

