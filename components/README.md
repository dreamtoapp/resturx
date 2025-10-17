# Components Directory

This directory contains reusable UI components and shared functionality used throughout the application.

## StickyBreadcrumb Component

A globally reusable breadcrumb navigation component that sticks below the fixed header during scroll.

### Features
- ✅ Fixed positioning below header (always visible during scroll)
- ✅ Matches header styling exactly (98% bg opacity, medium blur, subtle shadow)
- ✅ Glass-morphism effect for modern, cohesive design
- ✅ Responsive (adapts to mobile/desktop header heights)
- ✅ RTL-friendly for Arabic content
- ✅ Accessible with proper ARIA labels
- ✅ Optional icon support per breadcrumb item

### Usage

```tsx
import StickyBreadcrumb from '@/components/StickyBreadcrumb';

export default function YourPage() {
  return (
    <>
      <StickyBreadcrumb
        items={[
          { label: 'الرئيسية', href: '/' },
          { label: 'المطابخ', href: '/cuisines' },
          { label: 'مطبخ إيطالي' } // Last item (no href = current page)
        ]}
      />
      
      <div className="container mx-auto">
        {/* Your page content */}
      </div>
    </>
  );
}
```

### Props

```typescript
interface BreadcrumbItem {
  label: string;        // Display text
  href?: string;        // Link URL (omit for current/last page)
  icon?: string;        // Optional icon name from Icon component
}

interface StickyBreadcrumbProps {
  items: BreadcrumbItem[];  // Array of breadcrumb items
  className?: string;       // Optional additional CSS classes
}
```

### Examples

**Simple breadcrumb:**
```tsx
<StickyBreadcrumb
  items={[
    { label: 'الرئيسية', href: '/' },
    { label: 'المنتجات' }
  ]}
/>
```

**With icons:**
```tsx
<StickyBreadcrumb
  items={[
    { label: 'الرئيسية', href: '/', icon: 'Home' },
    { label: 'المطابخ', href: '/cuisines', icon: 'UtensilsCrossed' },
    { label: 'إيطالي' }
  ]}
/>
```

**With custom styling:**
```tsx
<StickyBreadcrumb
  items={breadcrumbItems}
  className="border-t border-primary/20"
/>
```

### Technical Details

- **Fixed Position**: `top-14` (mobile) / `top-16` (desktop) - perfectly aligned below header
- **Z-Index**: `z-40` - ensures visibility above content but below modals (header is z-50)
- **Background**: `bg-background/98` - matches header opacity for visual consistency
- **Backdrop Blur**: `backdrop-blur-md` - medium blur matching header glass-morphism
- **Border**: `border-b border-border/30` - subtle separator with 30% opacity
- **Shadow**: `shadow-sm` - subtle elevation effect like the header
- **Transitions**: `transition-all duration-300` - smooth animations on state changes
- **Responsive**: Automatically adjusts positioning based on screen size
- **UX Best Practice**: Always visible during scroll for constant navigation context

### Integration Guide

1. **Import the component** in your page file
2. **Place it at the top** of your page return statement (before container)
3. **Define your breadcrumb items** array with proper hierarchy
4. **Last item should not have href** (represents current page)

### Pages Currently Using This Component

- `/cuisines` - Cuisine listing page

### Best Practices

- Keep breadcrumb hierarchy logical and shallow (max 4 levels)
- Last item should always be the current page (no href)
- Use clear, concise labels
- Test on mobile to ensure touch targets are adequate
- Ensure proper RTL text rendering for Arabic content

### Accessibility

- Uses semantic `<nav>` and `<ol>` elements
- Includes `aria-label="Breadcrumb"` for screen readers
- Proper link hierarchy with hover states
- Sufficient color contrast for text visibility
