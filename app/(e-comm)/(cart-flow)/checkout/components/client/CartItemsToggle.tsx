'use client';

import { ChevronDown, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { formatCurrency } from '../../../../../../lib/formatCurrency';
import { useCurrency } from '@/store/currencyStore';

interface CartItem {
    id: string;
    quantity: number;
    product: {
        id: string;
        name: string;
        price: number;
        image?: string;
    } | null;
}

interface CartItemsToggleProps {
    items: CartItem[];
}

export default function CartItemsToggle({ items }: CartItemsToggleProps) {
    const { currency } = useCurrency();

    return (
        <Collapsible>
            {/* Cart Items Toggle */}
            <CollapsibleTrigger asChild>
                <Button
                    variant="outline"
                    className="w-full justify-between h-10 border-input text-foreground hover:bg-accent group"
                >
                    <span className="font-semibold text-foreground group-data-[state=open]:hidden">عرض المنتجات</span>
                    <span className="font-semibold  hidden group-data-[state=open]:inline">إخفاء المنتجات</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                </Button>
            </CollapsibleTrigger>

            {/* Cart Items List */}
            <CollapsibleContent className="space-y-2 pt-3">
                {items.map((item, idx) => (
                    <div
                        key={item.id || item.product?.id || idx}
                        className="flex items-center justify-between p-3 bg-muted border rounded-lg"
                    >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center flex-shrink-0">
                                <Package className="h-4 w-4 text-primary-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm text-foreground truncate">
                                    {item.product?.name || 'منتج غير معروف'}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    الكمية: {item.quantity}
                                </p>
                            </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                            <p className="font-bold text-sm text-foreground">
                                {formatCurrency((item.product?.price || 0) * (item.quantity || 1), currency)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {formatCurrency(item.product?.price || 0, currency)} × {item.quantity}
                            </p>
                        </div>
                    </div>
                ))}
            </CollapsibleContent>
        </Collapsible>
    );
} 