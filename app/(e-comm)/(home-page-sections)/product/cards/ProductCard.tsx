'use client';
import { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Product } from '@/types/databaseTypes';
import ProductCardMedia from './ProductCardMedia';
import ProductCardActions from './ProductCardActions';
import { useRouter } from 'next/navigation';
import { Eye, MessageCircle, Star } from 'lucide-react';
import { useCurrency } from '@/store/currencyStore';
import { formatCurrency } from '@/lib/formatCurrency';


interface ProductCardProps {
    product: Product;
    quantity: number;
    isInCart: boolean;
    className?: string;
    index?: number; // For analytics tracking
    priority?: boolean;
    logo?: string; // Company logo for fallback
}

const ProductCard = memo(({
    product,
    quantity,
    isInCart,
    index,
    priority,
    logo = '/fallback/dreamToApp2-dark.png'
}: ProductCardProps) => {
    const router = useRouter();
    const { currency } = useCurrency();
    const [currentCartState, setCurrentCartState] = useState(isInCart);

    // Memoized calculations for performance
    const stockInfo = useMemo(() => {
        const isOutOfStock = product.outOfStock
        const lowStock = !isOutOfStock && product.manageInventory && (product.stockQuantity ?? 0) > 0 && (product.stockQuantity ?? 0) <= 3;
        return { isOutOfStock, lowStock };
    }, [product.outOfStock, product.manageInventory, product.stockQuantity]);

    // Memoized pricing calculations
    const pricingInfo = useMemo(() => {
        const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
        const discountPercentage = hasDiscount && product.compareAtPrice
            ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
            : 0;
        return { hasDiscount, discountPercentage };
    }, [product.compareAtPrice, product.price]);

    // Sync internal cart state with prop changes
    useEffect(() => {
        setCurrentCartState(isInCart);
    }, [isInCart]);

    // Analytics tracking
    const trackProductView = useCallback(() => {
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'view_item', {
                currency: currency,
                value: product.price,
                items: [{
                    item_id: product.id,
                    item_name: product.name,
                    item_category: product.type,
                    price: product.price,
                    quantity: 1,
                    index: index
                }]
            });
        }
    }, [product, index, currency]);

    // Mouse/touch navigation on media area
    const handleMediaClick = useCallback((e: React.MouseEvent) => {
        const target = e.target as HTMLElement | null;
        // Ignore clicks originating from buttons/links inside media (e.g., Quick View)
        if (target && (target.closest('button') || target.closest('a'))) return;
        trackProductView();
        router.push(`/product/${product.slug}`);
    }, [router, product.slug, trackProductView]);

    // Keyboard navigation handler
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            trackProductView();
            router.push(`/product/${product.slug}`);
        }
    }, [router, product.slug, trackProductView]);

    // Structured data for SEO
    const structuredData = useMemo(() => ({
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "description": product.details,
        "image": product.imageUrl,
        "offers": {
            "@type": "Offer",
            "price": product.price,
            "priceCurrency": currency,
            "availability": stockInfo.isOutOfStock ? "OutOfStock" : "InStock"
        }
    }), [product, stockInfo.isOutOfStock, currency]);

    return (
        <>
            {/* Structured Data for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />

            <Card
                className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-card to-card/95 shadow-xl border-none w-full flex flex-col"
                tabIndex={0}
                onKeyDown={handleKeyDown}
            >
                {/* Media Section - 60% height (400x400) - CLIENT REQUIREMENT + INDUSTRY STANDARD */}
                <div className="relative w-full aspect-square" onClick={handleMediaClick}>
                    <ProductCardMedia
                        product={product}
                        inCart={currentCartState}
                        isOutOfStock={stockInfo.isOutOfStock}
                        lowStock={stockInfo.lowStock}
                        stockQuantity={product.stockQuantity}
                        priority={priority}
                        logo={logo}
                    />
                </div>
                {/* Content Section - 40% height (400x200) - OPTIMIZED FOR MOBILE */}
                <div className="flex-1 flex flex-col p-4 gap-3 min-h-[160px]">
                    {/* Product Name & Type - Enhanced Typography Hierarchy */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-sm sm:text-base leading-tight text-foreground line-clamp-2" title={product.name}>
                                {product.name}
                            </h3>
                        </div>
                        {/* Price Section - Enhanced Visual Hierarchy */}
                        <div className="flex items-center gap-3">
                            <span className="text-lg sm:text-xl font-bold text-feature-commerce">
                                {formatCurrency(product.price, currency)}
                            </span>
                            {pricingInfo.hasDiscount && (
                                <span className="text-sm line-through text-muted-foreground/70">
                                    {formatCurrency(product.compareAtPrice!, currency)}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Analytics Footer: Enhanced UI/UX with Micro-interactions */}
                    <div className="pt-2 text-center border-t border-border/20">
                        <div className="flex items-center justify-center gap-4 text-sm py-2">
                            {/* Rating */}
                            {typeof product.rating === 'number' && product.rating > 0 && (
                                <span className="flex items-center gap-1 text-yellow-500">
                                    <Star className="w-4 h-4 fill-current" fill="currentColor" />
                                    <span className="text-foreground font-medium">{product.rating}</span>
                                </span>
                            )}
                            {/* Comments */}
                            {product.reviewCount > 0 && (
                                <span className="flex items-center gap-1 text-muted-foreground">
                                    <MessageCircle className="w-4 h-4" />
                                    <span className="font-medium">{product.reviewCount}</span>
                                </span>
                            )}
                            {/* Preview count */}
                            <span className="flex items-center gap-1 text-primary-foreground">
                                <Eye className="w-4 h-4" />
                                <span className="font-medium">{product.previewCount}</span>
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <ProductCardActions
                        product={product}
                        quantity={quantity}
                        isOutOfStock={stockInfo.isOutOfStock}
                    />
                </div>
            </Card>
        </>
    );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;