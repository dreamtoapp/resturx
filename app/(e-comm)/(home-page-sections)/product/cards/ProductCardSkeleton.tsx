'use client';
import { Card } from '@/components/ui/card';
import { memo } from 'react';

interface ProductCardSkeletonProps {
    className?: string;
    showActions?: boolean;
}

const ProductCardSkeleton = memo(({ className, showActions = true }: ProductCardSkeletonProps) => {
    return (
        <Card
            className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br from-card to-card/95 shadow-xl border-none w-full max-w-sm mx-auto flex flex-col animate-pulse ${className || ''}`}
            role="status"
            aria-label="تحميل معلومات المنتج"
        >
            {/* Media Section Skeleton (simple) */}
            <div className="relative w-full aspect-square overflow-hidden rounded-t-xl bg-muted">
                <div className="absolute inset-0 bg-gradient-to-r from-muted via-muted/80 to-muted animate-pulse" />
            </div>

            {/* Content Section Skeleton */}
            <div className="flex-1 flex flex-col p-4 gap-3 min-h-[160px]">
                {/* Product Name & Price */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="h-5 bg-muted-foreground/20 rounded w-3/4" />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-6 bg-muted-foreground/20 rounded w-20" />
                        <div className="h-4 bg-muted-foreground/10 rounded w-14" />
                    </div>
                </div>
                {/* Simple spacing */}
                <div className="pt-1" />
                {/* Actions Section Skeleton */}
                {showActions && (
                    <div className="flex flex-col gap-3 mt-auto">
                        {/* Simulate add to cart button or quantity controls */}
                        <div className="w-full h-10 bg-muted-foreground/20 rounded-md" />
                    </div>
                )}
            </div>
            <span className="sr-only">جاري تحميل بيانات المنتج...</span>
        </Card>
    );
});

ProductCardSkeleton.displayName = 'ProductCardSkeleton';

export default ProductCardSkeleton; 