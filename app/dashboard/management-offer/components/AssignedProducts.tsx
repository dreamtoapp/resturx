'use client';

import { useState } from 'react';
import { Package, Trash2, Eye, AlertTriangle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

import { removeProductFromOffer } from '../actions/manage-products';
import Link from '@/components/link';
import AddImage from '@/components/AddImage';
import { toast } from 'sonner';
import { useCurrency } from '@/store/currencyStore';
import { formatCurrency } from '@/lib/formatCurrency';

// Empty State Component
function EmptyState() {
    return (
        <div className="text-center py-8">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-base font-semibold text-muted-foreground mb-1">
                لا توجد منتجات في هذا العرض
            </h3>
            <p className="text-sm text-muted-foreground">
                ابدأ بإضافة منتجات من القسم أدناه
            </p>
        </div>
    );
}

// Product Image Component
function ProductImage({
    imageUrl,
    productName,
    productId,
    hasDiscount,
    discountPercentage
}: {
    imageUrl?: string;
    productName: string;
    productId: string;
    hasDiscount: boolean;
    discountPercentage?: number | null;
}) {
    return (
        <div className="relative aspect-square w-full mb-3 overflow-hidden rounded-md bg-gradient-to-br from-muted/50 to-muted">
            <AddImage
                url={imageUrl || undefined}
                alt={`صورة ${productName}`}
                className="object-cover"
                recordId={productId}
                table="product"
                tableField="imageUrl"
                onUploadComplete={() => {
                    toast.success('تم تحديث صورة المنتج بنجاح');
                    // Refresh the page to show the new image
                    setTimeout(() => window.location.reload(), 1000);
                }}
                autoUpload={true}
            />

            {/* Discount Badge */}
            {hasDiscount && discountPercentage && (
                <div className="absolute top-2 left-2 bg-emerald-500 text-white px-2 py-1 rounded text-xs font-medium">
                    -{discountPercentage}%
                </div>
            )}
        </div>
    );
}

// Product Price Component
function ProductPrice({
    originalPrice,
    hasDiscount,
    discountPercentage
}: {
    originalPrice: number;
    hasDiscount: boolean;
    discountPercentage?: number | null;
}) {
    const { currency } = useCurrency();

    const calculateDiscountedPrice = (price: number) => {
        if (!hasDiscount || !discountPercentage) return price;
        return price - (price * discountPercentage / 100);
    };

    const discountedPrice = calculateDiscountedPrice(originalPrice);

    if (hasDiscount && discountPercentage) {
        return (
            <div className="flex items-center gap-2">
                <span className="text-base font-bold text-emerald-600">
                    {formatCurrency(discountedPrice, currency)}
                </span>
                <span className="text-sm text-muted-foreground line-through">
                    {formatCurrency(originalPrice, currency)}
                </span>
            </div>
        );
    }

    return (
        <span className="text-base font-bold text-emerald-600">
            {formatCurrency(originalPrice, currency)}
        </span>
    );
}

// Product Actions Component
function ProductActions({
    productId,
    productName,
    offerName,
    isRemoving,
    onRemove
}: {
    productId: string;
    productName: string;
    offerName: string;
    isRemoving: boolean;
    onRemove: (id: string) => void;
}) {
    return (
        <div className="flex items-center gap-2 pt-1">
            <Link
                href={`/dashboard/management-products/view/${productId}`}
                className="flex-1"
            >
                <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                >
                    <Eye className="h-4 w-4" />
                    عرض
                </Button>
            </Link>

            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        disabled={isRemoving}
                    >
                        {isRemoving ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
                        ) : (
                            <Trash2 className="h-4 w-4" />
                        )}
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-destructive" />
                            حذف المنتج من العرض
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            هل أنت متأكد من حذف &quot;{productName}&quot; من عرض &quot;{offerName}&quot;؟
                            <br />
                            <span className="text-xs text-muted-foreground mt-2 block">
                                لن يتم حذف المنتج نفسه، فقط إزالته من هذا العرض.
                            </span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>إلغاء</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => onRemove(productId)}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            حذف من العرض
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

// Product Card Component
function ProductCard({
    product,
    hasDiscount,
    discountPercentage,
    offerName,
    isRemoving,
    onRemove
}: {
    product: AssignedProduct['product'];
    hasDiscount: boolean;
    discountPercentage?: number | null;
    offerName: string;
    isRemoving: boolean;
    onRemove: (id: string) => void;
}) {
    return (
        <div className="border border-border rounded-lg p-4 w-full max-w-[200px] mx-auto">
            <ProductImage
                imageUrl={product.imageUrl || product.images?.[0]}
                productName={product.name}
                productId={product.id}
                hasDiscount={hasDiscount}
                discountPercentage={discountPercentage}
            />

            <div className="space-y-2">
                <h4 className="font-semibold text-sm line-clamp-2 text-foreground">
                    {product.name}
                </h4>

                <ProductPrice
                    originalPrice={product.price}
                    hasDiscount={hasDiscount}
                    discountPercentage={discountPercentage}
                />

                {product.categoryAssignments && product.categoryAssignments.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                        {product.categoryAssignments[0].category.name}
                    </p>
                )}

                <ProductActions
                    productId={product.id}
                    productName={product.name}
                    offerName={offerName}
                    isRemoving={isRemoving}
                    onRemove={onRemove}
                />
            </div>
        </div>
    );
}

interface AssignedProduct {
    product: {
        id: string;
        name: string;
        slug: string;
        price: number;
        imageUrl?: string | null;
        images: string[];
        supplierId: string;
        categoryAssignments: Array<{
            category: {
                name: string;
            };
        }>;
    };
}

interface AssignedProductsProps {
    offerId: string;
    offerName: string;
    assignedProducts: AssignedProduct[];
    hasDiscount: boolean;
    discountPercentage?: number | null;
}

export function AssignedProducts({
    offerId,
    offerName,
    assignedProducts,
    hasDiscount,
    discountPercentage
}: AssignedProductsProps) {
    const [removingProductId, setRemovingProductId] = useState<string | null>(null);

    const handleRemoveProduct = async (productId: string) => {
        setRemovingProductId(productId);
        try {
            await removeProductFromOffer(offerId, productId);
            // The page will refresh automatically due to revalidatePath
        } catch (error) {
            console.error('Error removing product:', error);
        } finally {
            setRemovingProductId(null);
        }
    };

    return (
        <Card className="border">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Package className="h-4 w-4 text-primary" />
                    المنتجات في العرض: {offerName}
                </CardTitle>
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        إجمالي المنتجات: {assignedProducts.length}
                    </p>
                    {hasDiscount && discountPercentage && (
                        <Badge className="bg-emerald-500 text-white">
                            خصم {discountPercentage}%
                        </Badge>
                    )}
                </div>
            </CardHeader>

            <CardContent>
                {assignedProducts.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="flex flex-wrap gap-4 justify-center">
                        {assignedProducts.map(({ product }) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                hasDiscount={hasDiscount}
                                discountPercentage={discountPercentage}
                                offerName={offerName}
                                isRemoving={removingProductId === product.id}
                                onRemove={handleRemoveProduct}
                            />
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
} 