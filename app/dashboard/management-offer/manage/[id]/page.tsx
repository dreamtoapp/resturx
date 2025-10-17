import { notFound } from 'next/navigation';
import { Package, Settings } from 'lucide-react';
import { getOfferById } from '../../actions';
import { AssignedProducts } from '../../components/AssignedProducts';
import { OfferBannerUpload } from '../../components/OfferBannerUpload';
import OfferProductDialog from '../../components/OfferProductDialog';

interface ManageOfferPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ManageOfferPage({ params }: ManageOfferPageProps) {
    // Await the params Promise
    const { id } = await params;

    // Fetch offer data
    const offer = await getOfferById(id).catch(() => null);

    if (!offer) {
        notFound();
    }


    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-background p-4">
                <div className="flex items-center gap-3">
                    <Settings className="h-5 w-5 text-primary" />
                    <div>
                        <h1 className="text-lg font-semibold text-foreground">إدارة منتجات العرض</h1>
                        <p className="text-sm text-muted-foreground">{offer.name}</p>
                    </div>
                    <div className="ml-auto">
                        {/* Supplier ID requirement: using offer's first product supplier if exists, else fallback to company default if available. */}
                        {(() => {
                            const supplierId = offer.productAssignments?.[0]?.product?.supplierId || '000000000000000000000000';
                            return (
                                <OfferProductDialog offerId={offer.id} supplierId={supplierId} />
                            );
                        })()}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="p-4 space-y-6">
                {/* Banner Upload */}
                <OfferBannerUpload
                    offerId={offer.id}
                    offerName={offer.name}
                    currentBannerUrl={offer.bannerImage}
                />

                {/* Offer Info */}
                <div className="bg-card border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Package className="h-5 w-5 text-primary" />
                            <div>
                                <h2 className="font-semibold text-foreground">{offer.name}</h2>
                                {offer.description && (
                                    <p className="text-sm text-muted-foreground">{offer.description}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                            <div className="text-center">
                                <div className="font-semibold text-primary">{offer.productAssignments?.length || 0}</div>
                                <div className="text-xs text-muted-foreground">منتج</div>
                            </div>
                            {offer.hasDiscount && offer.discountPercentage && (
                                <div className="text-center">
                                    <div className="font-semibold text-emerald-600">{offer.discountPercentage}%</div>
                                    <div className="text-xs text-muted-foreground">خصم</div>
                                </div>
                            )}
                            <div className="text-center">
                                <div className={`font-semibold ${offer.isActive ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                                    {offer.isActive ? 'نشط' : 'غير نشط'}
                                </div>
                                <div className="text-xs text-muted-foreground">الحالة</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Current Products */}
                <AssignedProducts
                    offerId={offer.id}
                    offerName={offer.name}
                    assignedProducts={offer.productAssignments || []}
                    hasDiscount={offer.hasDiscount}
                    discountPercentage={offer.discountPercentage}
                />

            </main>
        </div>
    );
} 