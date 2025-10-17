import { Package, Plus } from 'lucide-react';
import Link from '@/components/link';
import { buttonVariants } from '@/components/ui/button';
import { getOffers, type Offer } from './actions/get-offers';
import OfferCard from './components/OfferCard';

// Header Component
function PageHeader({ activeCount, inactiveCount }: { activeCount: number; inactiveCount: number }) {
    return (
        <header className="border-b bg-background p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Package className="h-6 w-6 text-feature-commerce" />
                    <h1 className="text-xl font-semibold text-feature-commerce">
                        إدارة العروض
                    </h1>
                    <div className="flex gap-2 text-sm">
                        <span className="text-emerald-500">{activeCount} نشط</span>
                        {inactiveCount > 0 && (
                            <span className="text-muted-foreground">{inactiveCount} غير نشط</span>
                        )}
                    </div>
                </div>

                <Link
                    href="/dashboard/management-offer/new"
                    className={buttonVariants({ variant: "default", size: "sm" })}
                >
                    <Plus className="h-4 w-4 mr-1" />
                    إضافة عرض
                </Link>
            </div>
        </header>
    );
}

// Statistics Component
function StatisticsCards({ activeCount, inactiveCount, totalProducts }: {
    activeCount: number;
    inactiveCount: number;
    totalProducts: number;
}) {
    return (
        <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 bg-secondary border border-emerald-400 rounded-lg">
                <div className="text-lg font-semibold text-emerald-600">{activeCount}</div>
                <div className="text-xs text-muted-foreground">نشط</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-lg font-semibold text-muted-foreground">{inactiveCount}</div>
                <div className="text-xs text-muted-foreground">غير نشط</div>
            </div>
            <div className="text-center p-3 bg-primary/10 rounded-lg">
                <div className="text-lg font-semibold text-primary">{totalProducts}</div>
                <div className="text-xs text-muted-foreground">منتج</div>
            </div>
        </div>
    );
}

// Active Offers Section Component
function ActiveOffersSection({ offers }: { offers: Offer[] }) {
    if (offers.length === 0) return null;

    return (
        <section className="mb-6">
            <h2 className="text-lg font-medium mb-3 text-foreground">العروض النشطة</h2>
            <div className="flex flex-wrap gap-4 justify-center">
                {offers.map((offer) => (
                    <OfferCard key={offer.id} offer={offer} />
                ))}
            </div>
        </section>
    );
}

// Inactive Offers Section Component
function InactiveOffersSection({ offers }: { offers: Offer[] }) {
    if (offers.length === 0) return null;

    return (
        <section className="mb-6">
            <h2 className="text-lg font-medium mb-3 text-muted-foreground">العروض غير النشطة</h2>
            <div className="flex flex-wrap gap-4 justify-center">
                {offers.map((offer) => (
                    <OfferCard key={offer.id} offer={offer} />
                ))}
            </div>
        </section>
    );
}

// Empty State Component
function EmptyState() {
    return (
        <div className="text-center py-8">
            <Package className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-base font-medium mb-2 text-muted-foreground">لا توجد عروض</h3>
            <Link
                href="/dashboard/management-offer/new"
                className={buttonVariants({ variant: "default", size: "sm" })}
            >
                <Plus className="h-4 w-4 mr-1" />
                إضافة عرض
            </Link>
        </div>
    );
}

export default async function ManagementOfferPage() {
    const offers = await getOffers();
    const activeOffers = offers.filter(offer => offer.isActive);
    const inactiveOffers = offers.filter(offer => !offer.isActive);
    const totalProducts = offers.reduce((total, offer) => total + (offer._count?.productAssignments || 0), 0);

    return (
        <div className="min-h-screen bg-background">
            <PageHeader
                activeCount={activeOffers.length}
                inactiveCount={inactiveOffers.length}
            />

            <main className="p-4">
                <StatisticsCards
                    activeCount={activeOffers.length}
                    inactiveCount={inactiveOffers.length}
                    totalProducts={totalProducts}
                />

                <ActiveOffersSection offers={activeOffers} />
                <InactiveOffersSection offers={inactiveOffers} />

                {offers.length === 0 && <EmptyState />}
            </main>
        </div>
    );
}