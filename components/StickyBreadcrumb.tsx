import Link from '@/components/link';
import { Icon } from '@/components/icons/Icon';
import { LucideIcon } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: LucideIcon | string;
}

interface StickyBreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Reusable sticky breadcrumb component for the entire app
 * Uses fixed positioning to ensure it sticks below header regardless of parent containers
 * Matches header styling exactly for visual consistency (98% bg, medium blur, subtle shadow)
 * 
 * UX Best Practice: Always visible for constant navigation context
 * 
 * @example
 * <StickyBreadcrumb 
 *   items={[
 *     { label: 'الرئيسية', href: '/' },
 *     { label: 'المطابخ', href: '/cuisines' },
 *     { label: 'مطبخ إيطالي' }
 *   ]} 
 * />
 */
export default function StickyBreadcrumb({ items, className = '' }: StickyBreadcrumbProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className="fixed top-14 sm:top-16 left-0 right-0 z-40 w-full">
      <nav
        className={`bg-background/98 backdrop-blur-md border-b border-border/30 shadow-sm transition-all duration-300 py-3 ${className}`}
        aria-label="Breadcrumb"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
            {items.map((item, index) => {
              const isLast = index === items.length - 1;

              return (
                <li key={index} className="flex items-center gap-2">
                  {item.href && !isLast ? (
                    <Link
                      href={item.href}
                      className="hover:text-foreground transition-colors duration-200 flex items-center gap-1.5"
                    >
                      {item.icon && typeof item.icon === 'string' && (
                        <Icon name={item.icon as any} className="h-4 w-4" />
                      )}
                      <span>{item.label}</span>
                    </Link>
                  ) : (
                    <span
                      className={`flex items-center gap-1.5 ${isLast ? 'text-foreground font-medium' : ''}`}
                    >
                      {item.icon && typeof item.icon === 'string' && (
                        <Icon name={item.icon as any} className="h-4 w-4" />
                      )}
                      <span>{item.label}</span>
                    </span>
                  )}
                  {!isLast && <Icon name="ChevronRight" className="h-4 w-4 text-muted-foreground/60" />}
                </li>
              );
            })}
          </ol>
        </div>
      </nav>
    </div>
  );
}

