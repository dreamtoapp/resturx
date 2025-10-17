"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AddressBook from "./AddressBook";
import UserInfoCard from "./UserInfoCard";
import MiniCartSummary from "./MiniCartSummary";
import ShiftSelectorWrapper from "./ShiftSelectorWrapper";
import PaymentMethodSelector from "./PaymentMethodSelector";
import PlaceOrderButton from "./PlaceOrderButton";
// import CheckoutValidation from "./CheckoutValidation";
import { AddressWithDefault } from "./AddressBook";
import { UserProfile } from "./UserInfoCard";
import { CartData } from "./PlaceOrderButton";
import { TermsDialogContent } from "./TermsDialog";
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { useCartStore } from '@/app/(e-comm)/(cart-flow)/cart/cart-controller/cartStore';
import type { Policy } from "./TermsDialog";

interface PlatformSettings {
    taxPercentage: number;
    shippingFee: number;
    minShipping: number;
}

interface CheckoutClientProps {
    user: UserProfile;
    cart: CartData;
    addresses: AddressWithDefault[];
    platformSettings: PlatformSettings;
    requireOtp?: boolean;
    requireLocation?: boolean;
}

interface TermsAcceptanceCardProps {
    termsDialogOpen: boolean;
    setTermsDialogOpen: (v: boolean) => void;
    policies: Policy[];
    loadingPolicies: boolean;
    policiesError: string;
    activeTab: string;
    setActiveTab: (v: string) => void;
    fetchPolicies: () => Promise<void>;
}

function TermsAcceptanceCard({
    termsDialogOpen,
    setTermsDialogOpen,
    policies,
    loadingPolicies,
    policiesError,
    activeTab,
    setActiveTab,
    fetchPolicies
}: TermsAcceptanceCardProps) {
    return (
        <Card className={`border rounded-xl bg-muted`} dir="rtl">
            <CardContent className="p-4">
                <div className="flex items-center">
                    <Dialog open={termsDialogOpen} onOpenChange={(open) => { setTermsDialogOpen(open); if (open) fetchPolicies(); }}>
                        <DialogTrigger asChild>
                            <button className="group inline-flex items-center gap-1 underline text-sm font-medium text-foreground hover:text-foreground/80">
                                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground transition-colors group-hover:text-foreground" />
                                الشروط والأحكام
                            </button>
                        </DialogTrigger>
                        <DialogContent className="max-h-[90vh] max-w-4xl" dir="rtl">
                            <TermsDialogContent
                                policies={policies}
                                loading={loadingPolicies}
                                error={policiesError}
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                                getPolicyIcon={(title: string) => {
                                    switch (title) {
                                        case 'سياسة الموقع': return <FileText className="h-4 w-4" />;
                                        case 'سياسة الخصوصية': return <AlertCircle className="h-4 w-4" />;
                                        case 'سياسة الإرجاع': return <CheckCircle className="h-4 w-4" />;
                                        case 'سياسة الشحن': return <AlertCircle className="h-4 w-4" />;
                                        default: return <FileText className="h-4 w-4" />;
                                    }
                                }}
                                getPolicySummary={(title: string) => {
                                    switch (title) {
                                        case 'سياسة الموقع': return 'شروط استخدام الموقع وحقوق الملكية الفكرية';
                                        case 'سياسة الخصوصية': return 'كيفية جمع وحماية بياناتك الشخصية';
                                        case 'سياسة الإرجاع': return 'شروط إرجاع المنتجات واسترداد المبالغ';
                                        case 'سياسة الشحن': return 'خدمات التوصيل والرسوم والأوقات';
                                        default: return 'سياسة عامة';
                                    }
                                }}
                                extractKeyPoints={(content: string) => {
                                    const lines = content.split('\n');
                                    return lines
                                        .filter(line => line.trim().startsWith('•') || line.trim().startsWith('-'))
                                        .slice(0, 5)
                                        .map(point => point.replace(/^[•\-]\s*/, '').trim());
                                }}
                            />
                        </DialogContent>
                    </Dialog>
                </div>
            </CardContent>
        </Card>
    );
}

export default function CheckoutClient({ user, cart, addresses, platformSettings, requireOtp, requireLocation }: CheckoutClientProps) {
    const router = useRouter();
    const { cart: zustandCart } = useCartStore();
    const [selectedAddress, setSelectedAddress] = useState<AddressWithDefault | null>(addresses.find(addr => addr.isDefault) || addresses[0] || null);
    const [selectedShiftId, setSelectedShiftId] = useState("");
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("CASH");
    const [termsAccepted] = useState(false);
    const [termsDialogOpen, setTermsDialogOpen] = useState(false);
    const [policies, setPolicies] = useState<Policy[]>([]);
    const [loadingPolicies, setLoadingPolicies] = useState(false);
    const [policiesError, setPoliciesError] = useState("");
    const [activeTab, setActiveTab] = useState("summary");

    // Check if both database cart and Zustand cart are empty
    useEffect(() => {
        const databaseCartEmpty = !cart?.items || cart.items.length === 0;
        const zustandCartEmpty = Object.keys(zustandCart).length === 0;

        if (databaseCartEmpty && zustandCartEmpty) {
            console.log("Both database and Zustand carts are empty, redirecting to cart");
            router.push("/cart?message=empty");
        }
    }, [cart, zustandCart, router]);

    // Checkout progress UI removed as requested

    const fetchPolicies = async () => {
        setLoadingPolicies(true);
        setPoliciesError("");
        try {
            const [websitePolicy, privacyPolicy, returnPolicy, shippingPolicy] = await Promise.allSettled([
                fetch('/api/policies/website').then(res => res.json()),
                fetch('/api/policies/privacy').then(res => res.json()),
                fetch('/api/policies/return').then(res => res.json()),
                fetch('/api/policies/shipping').then(res => res.json())
            ]);
            const activePolicies = [];
            if (websitePolicy.status === 'fulfilled' && websitePolicy.value.isPublished) activePolicies.push(websitePolicy.value);
            if (privacyPolicy.status === 'fulfilled' && privacyPolicy.value.isPublished) activePolicies.push(privacyPolicy.value);
            if (returnPolicy.status === 'fulfilled' && returnPolicy.value.isPublished) activePolicies.push(returnPolicy.value);
            if (shippingPolicy.status === 'fulfilled' && shippingPolicy.value.isPublished) activePolicies.push(shippingPolicy.value);
            setPolicies(activePolicies);
        } catch (err) {
            setPoliciesError('فشل تحميل الشروط والأحكام. يرجى المحاولة لاحقاً');
        } finally {
            setLoadingPolicies(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Progress bar removed */}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {user && <UserInfoCard user={user} requireOtp={requireOtp} />}
                        <AddressBook
                            addresses={addresses}
                            onSelectAddress={id => setSelectedAddress(addresses.find(a => a.id === id) || null)}
                            selectedAddressId={selectedAddress?.id || ""}
                        />
                        <ShiftSelectorWrapper selectedShiftId={selectedShiftId} onShiftSelect={setSelectedShiftId} />
                        <PaymentMethodSelector selectedPaymentMethod={selectedPaymentMethod} onSelectPayment={setSelectedPaymentMethod} />

                        {/* Enhanced Terms Acceptance Section */}
                        <TermsAcceptanceCard
                            termsDialogOpen={termsDialogOpen}
                            setTermsDialogOpen={setTermsDialogOpen}
                            policies={policies}
                            loadingPolicies={loadingPolicies}
                            policiesError={policiesError}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            fetchPolicies={fetchPolicies}
                        />

                        {/* Checkout Validation (temporarily disabled; handled at CTA) */}
                        {/**
                         * <CheckoutValidation
                         *   user={user}
                         *   selectedAddress={selectedAddress}
                         *   selectedShiftId={selectedShiftId}
                         *   selectedPaymentMethod={selectedPaymentMethod}
                         *   termsAccepted={termsAccepted}
                         *   cart={cart}
                         * />
                         */}

                        <PlaceOrderButton
                            user={user}
                            selectedAddress={selectedAddress}
                            shiftId={selectedShiftId}
                            paymentMethod={selectedPaymentMethod}
                            termsAccepted={termsAccepted}
                            requireOtp={requireOtp}
                            requireLocation={requireLocation}
                        />
                    </div>
                    <div className="space-y-6">
                        <MiniCartSummary platformSettings={platformSettings} />
                    </div>
                </div>
            </div>
        </div>
    );
} 