import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShoppingCart, AlertCircle, Loader2, Sparkles } from "lucide-react";
import { createDraftOrder } from '../actions/orderActions';
import { UserProfile } from './UserInfoCard';
import { AddressWithDefault } from "./AddressBook";
import { useCartStore } from '@/app/(e-comm)/(cart-flow)/cart/cart-controller/cartStore';
import { getCheckoutValidation } from '@/app/(e-comm)/helpers/checkoutValidation';

export interface CartItem {
    id: string;
    quantity: number;
    product: {
        id: string;
        name: string;
        price: number;
    } | null;
}

export interface CartData {
    items: CartItem[];
}

interface PlaceOrderButtonProps {
    cart?: CartData;
    user: UserProfile;
    selectedAddress: AddressWithDefault | null;
    shiftId: string;
    paymentMethod: string;
    termsAccepted: boolean;
    requireOtp?: boolean;
    requireLocation?: boolean;

}

export default function PlaceOrderButton({ cart, user, selectedAddress, shiftId, paymentMethod, termsAccepted, requireOtp, requireLocation }: PlaceOrderButtonProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Use Zustand cart for real-time updates and discounts
    const { cart: zustandCart } = useCartStore();
    const zustandItems = Object.values(zustandCart);

    // Use Zustand cart if available, otherwise fall back to props cart
    const items = zustandItems.length > 0 ? zustandItems : (cart?.items || []);





    // Shared validation (single source of truth)
    const normalizedAddress = selectedAddress
        ? {
            latitude: selectedAddress.latitude ? Number(selectedAddress.latitude) || null : null,
            longitude: selectedAddress.longitude ? Number(selectedAddress.longitude) || null : null,
        }
        : null;

    const { rules, isReady } = getCheckoutValidation({
        user,
        selectedAddress: normalizedAddress,
        shiftId,
        paymentMethod,
        itemsCount: items.length,
        termsAccepted,
        requireOtp: !!requireOtp,
        requireLocation: requireLocation !== false
    });
    const isValid = isReady;
    const errorMessages = rules.filter(r => r.severity === 'error').map(r => r.message);

    // Simple sync function
    const syncZustandToDatabase = async () => {
        try {
            const { syncZustandQuantityToDatabase } = await import('@/app/(e-comm)/(cart-flow)/cart/actions/cartServerActions');

            // Sync all Zustand items to database in parallel (replaces quantities, doesn't add)
            await Promise.all(
                Object.entries(zustandCart).map(([productId, item]) =>
                    syncZustandQuantityToDatabase(productId, (item as any).quantity)
                )
            );

            console.log('✅ Zustand cart synced to database');
        } catch (error) {
            console.error('❌ Failed to sync Zustand to database:', error);
            throw new Error('فشل في مزامنة السلة مع قاعدة البيانات');
        }
    };

    const handlePlaceOrder = async () => {
        if (loading) return;
        setLoading(true);
        setError(null);

        // Minimal dev-only validation log
        if (process.env.NODE_ENV !== 'production') {
            console.info('[Checkout] validation', {
                requireOtp: !!requireOtp,
                requireLocation: requireLocation !== false,
                errors: rules.map(r => r.id),
            });
        }

        // Frontend validation for shiftId
        if (!shiftId) {
            setError('يرجى اختيار وقت التوصيل');
            setLoading(false);
            return;
        }
        try {
            // Show blocking loader if SweetAlert2 is available
            try {
                const mod = await import('sweetalert2');
                const Swal = mod.default;
                Swal.fire({
                    title: 'جاري تجهيز طلبك…',
                    text: 'يرجى الانتظار لحظات',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showConfirmButton: false,
                    didOpen: () => Swal.showLoading(),
                });
            } catch { }

            // Simple sync: Update database cart with Zustand data
            await syncZustandToDatabase();

            const formData = new FormData();
            formData.append('fullName', user.name || '');
            formData.append('phone', user.phone || '');
            formData.append('addressId', selectedAddress?.id || '');
            formData.append('shiftId', shiftId);
            formData.append('paymentMethod', paymentMethod);
            formData.append('termsAccepted', termsAccepted ? 'true' : 'false');

            const orderNumber = await createDraftOrder(formData);
            try {
                const mod = await import('sweetalert2');
                mod.default.close();
            } catch { }
            router.push(`/happyorder?orderid=${orderNumber}`);
        } catch (err: any) {
            try {
                const mod = await import('sweetalert2');
                const Swal = mod.default;
                await Swal.fire({
                    icon: 'error',
                    title: 'تعذر تنفيذ الطلب',
                    text: err?.validationErrors?.join('، ') || err?.message || 'حدث خطأ غير متوقع',
                    confirmButtonText: 'حسناً',
                });
            } catch { }
            if (err?.validationErrors) setError(err.validationErrors.join('، '));
            else setError(err?.message || 'حدث خطأ أثناء تنفيذ الطلب');
            setLoading(false);
        } finally {
            try {
                const mod = await import('sweetalert2');
                const Swal = mod.default;
                if (Swal.isVisible()) Swal.close();
            } catch { }
            // keep loading true on success to avoid re-click before navigation
        }
    };

    return (
        <div className="space-y-6">
            {/* Place Order Button */}
            <div className="space-y-4">
                {!isValid && errorMessages.length > 0 && (
                    <div className="space-y-1">
                        {errorMessages.map((msg, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                                    <AlertCircle className="h-3 w-3" />
                                </span>
                                <span>{msg}</span>
                            </div>
                        ))}
                    </div>
                )}
                <Button
                    className={`w-full h-14 text-xl font-bold transition-all duration-300 transform ${isValid && !loading
                        ? 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 hover:shadow-xl hover:-translate-y-0.5'
                        : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                        } rounded-xl shadow-lg ${loading ? 'pointer-events-none' : ''}`}
                    disabled={!isValid || loading}
                    onClick={handlePlaceOrder}
                >
                    {loading ? (
                        <>
                            <Loader2 className="h-5 w-5 ml-2 animate-spin" />
                            جاري تنفيذ الطلب...
                        </>
                    ) : (
                        <>
                            <ShoppingCart className="h-5 w-5 ml-2" />
                            {isValid ? (
                                <span className="flex items-center gap-2">
                                    تنفيذ الطلب
                                    <Sparkles className="h-4 w-4" />
                                </span>
                            ) : (
                                'تنفيذ الطلب'
                            )}
                        </>
                    )}
                </Button>
            </div>

            {/* Error Display */}
            {error && (
                <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                            <AlertCircle className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-lg text-red-800 mb-1">خطأ في الطلب</h4>
                            <p className="text-base text-red-700 font-medium">
                                {Array.isArray(error) ? error.join('، ') : error}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 