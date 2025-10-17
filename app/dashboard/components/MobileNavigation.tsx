'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@/components/icons/Icon';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

import { cn } from '@/lib/utils';
import { navigationItems, type NavigationItem } from '../helpers/navigationMenu';
import { ScrollArea } from '@/components/ui/scroll-area';

type NavigationChild = NonNullable<NavigationItem['children']>[0];

interface MobileNavigationProps {
    pendingOrdersCount?: number;
}

export default function MobileNavigation({ pendingOrdersCount: _pendingOrdersCount = 0 }: MobileNavigationProps) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const isActive = (href: string) => {
        if (href === '/dashboard') {
            return pathname === '/dashboard';
        }
        return pathname.startsWith(href);
    };

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Icon name="Menu" className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] flex flex-col">
                <SheetHeader className="flex-shrink-0">
                    <SheetTitle className="text-right">القائمة الرئيسية</SheetTitle>
                </SheetHeader>
                <div className="flex-1 overflow-hidden">
                    <ScrollArea className="h-full">
                        <div className="px-4 py-2">
                            <Accordion type="single" collapsible className="w-full">
                                {navigationItems.map((item) => {
                                    const isItemActive = isActive(item.href);
                                    const hasChildren = item.children && item.children.length > 0;

                                    if (hasChildren) {
                                        return (
                                            <AccordionItem key={item.label} value={item.label}>
                                                <AccordionTrigger className={cn(
                                                    "text-right hover:no-underline",
                                                    isItemActive && "text-primary font-medium"
                                                )}>
                                                    <div className="flex items-center gap-3 w-full">
                                                        {item.icon && <Icon name={item.icon} className="h-4 w-4" />}
                                                        <span>{item.label}</span>
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    <div className="flex flex-col gap-1">
                                                        {item.children?.map((child: NavigationChild, index) => {
                                                            const isChildActive = child.href ? isActive(child.href) : false;

                                                            // Handle divider
                                                            if (child.label === '---') {
                                                                return (
                                                                    <div
                                                                        key={child.key || `divider-${index}`}
                                                                        className="border-t border-border my-2"
                                                                    />
                                                                );
                                                            }

                                                            // Skip items without href
                                                            if (!child.href) {
                                                                return null;
                                                            }

                                                            return (
                                                                <Link
                                                                    key={child.key || `${child.href}-${index}`}
                                                                    href={child.href}
                                                                    onClick={() => setIsOpen(false)}
                                                                    className={cn(
                                                                        "flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors",
                                                                        isChildActive
                                                                            ? "bg-primary text-primary-foreground"
                                                                            : "hover:bg-accent hover:text-accent-foreground"
                                                                    )}
                                                                >
                                                                    <Icon name={child.icon || 'Dot'} className="h-4 w-4" />
                                                                    <span>{child.label}</span>
                                                                </Link>
                                                            );
                                                        })}
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        );
                                    }

                                    // Skip items without href
                                    if (!item.href) {
                                        return null;
                                    }

                                    return (
                                        <Link
                                            key={item.label}
                                            href={item.href}
                                            onClick={() => setIsOpen(false)}
                                            className={cn(
                                                "flex items-center gap-3 px-4 py-3 text-sm rounded-md transition-colors",
                                                isItemActive
                                                    ? "bg-primary text-primary-foreground"
                                                    : "hover:bg-accent hover:text-accent-foreground"
                                            )}
                                        >
                                            {item.icon && <Icon name={item.icon} className="h-4 w-4" />}
                                            <span>{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </Accordion>
                        </div>
                    </ScrollArea>
                </div>
            </SheetContent>
        </Sheet>
    );
} 