import React from 'react';
import { Package, Percent, Eye, EyeOff, Edit3, Calendar, BarChart3 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import Link from '@/components/link';
import AddImage from '@/components/AddImage';

import type { Offer } from '../actions/get-offers';
import { ToggleOfferStatus } from './ToggleOfferStatus';
import { DeleteOfferAlert } from './DeleteOfferAlert';

interface OfferCardProps {
    offer: Offer;
}

const OfferStatusBadge = ({ offer }: { offer: Offer }) => (
    <Badge
        variant={offer.isActive ? 'default' : 'secondary'}
        className={`absolute left-3 top-3 ${offer.isActive
            ? 'bg-emerald-500 text-white'
            : 'bg-muted text-muted-foreground'
            }`}
    >
        {offer.isActive ? (
            <div className="flex items-center gap-1">
                <Eye size={12} />
                <span className="text-xs font-medium">نشط</span>
            </div>
        ) : (
            <div className="flex items-center gap-1">
                <EyeOff size={12} />
                <span className="text-xs font-medium">غير نشط</span>
            </div>
        )}
    </Badge>
);

const DiscountBadge = ({ offer }: { offer: Offer }) => {
    if (!offer.hasDiscount || !offer.discountPercentage) return null;

    return (
        <Badge className="absolute right-3 bottom-3 bg-primary text-primary-foreground">
            <div className="flex items-center gap-1">
                <Percent size={12} />
                <span className="text-xs font-semibold">{offer.discountPercentage}%</span>
            </div>
        </Badge>
    );
};

const OfferBanner = ({ offer }: { offer: Offer }) => (
    <div className="relative aspect-square w-full overflow-hidden rounded-lg border">
        <AddImage
            url={offer.bannerImage || undefined}
            recordId={offer.id}
            table="offer"
            tableField="bannerImage"
            autoUpload={true}
            className="w-full h-full object-contain bg-white"
            alt={`صورة بانر العرض - ${offer.name}`}
        />
        <OfferStatusBadge offer={offer} />
        <DiscountBadge offer={offer} />
    </div>
);

const OfferInfo = ({ offer }: { offer: Offer }) => (
    <div className="space-y-3">
        {/* Title and Description */}
        <div>
            <h3 className="font-semibold text-lg text-foreground mb-1 line-clamp-1">{offer.name}</h3>
            {offer.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                    {offer.description}
                </p>
            )}
        </div>

        {/* Business Metrics */}
        <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                <Package size={14} className="text-primary" />
                <div className="text-sm">
                    <div className="font-semibold text-foreground">{offer._count?.productAssignments || 0}</div>
                    <div className="text-xs text-muted-foreground">منتج</div>
                </div>
            </div>

            <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                <BarChart3 size={14} className="text-primary" />
                <div className="text-sm">
                    <div className="font-semibold text-foreground">{offer.displayOrder}</div>
                    <div className="text-xs text-muted-foreground">الترتيب</div>
                </div>
            </div>
        </div>

        {/* Discount Info */}
        {offer.hasDiscount && offer.discountPercentage && (
            <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                <Percent size={14} className="text-primary" />
                <span className="text-sm font-medium text-foreground">خصم {offer.discountPercentage}%</span>
            </div>
        )}
    </div>
);

const ActionButtons = ({ offer }: { offer: Offer }) => (
    <div className="flex items-center gap-2">
        {/* Primary Action - Manage Products */}
        <Link
            href={`/dashboard/management-offer/manage/${offer.id}`}
            className="flex-1"
        >
            <Button variant="default" size="sm" className="w-full">
                <Package size={14} />
                إدارة المنتجات
            </Button>
        </Link>

        {/* Secondary Actions */}
        <Link href={`/dashboard/management-offer/edit/${offer.id}`}>
            <Button variant="outline" size="sm">
                <Edit3 size={14} />
            </Button>
        </Link>

        <ToggleOfferStatus offer={offer} />
        <DeleteOfferAlert offerId={offer.id} />
    </div>
);

const OfferCard: React.FC<OfferCardProps> = ({ offer }) => {
    return (
        <Card className={`flex h-full flex-row flex-wrap overflow-hidden w-full max-w-sm mx-auto ${offer.isActive
            ? 'border-l-4 border-l-emerald-500'
            : 'border-l-4 border-l-muted opacity-75'
            }`}>
            <CardHeader className="pb-2 w-full">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-base text-foreground line-clamp-1">{offer.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar size={12} />
                        <span>{new Date(offer.createdAt).toLocaleDateString('ar-SA')}</span>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex-1 p-4 space-y-4 w-full">
                <OfferBanner offer={offer} />
                <OfferInfo offer={offer} />
            </CardContent>

            <CardFooter className="p-4 pt-0 w-full">
                <ActionButtons offer={offer} />
            </CardFooter>
        </Card>
    );
};

OfferCard.displayName = 'OfferCard';
export default OfferCard; 