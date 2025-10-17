'use client';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Banknote, CheckCircle, Lock, Shield } from "lucide-react";
import Image from "next/image";

interface PaymentMethodSelectorProps {
    selectedPaymentMethod: string;
    onSelectPayment: (method: string) => void;
}

export default function PaymentMethodSelector({ selectedPaymentMethod, onSelectPayment }: PaymentMethodSelectorProps) {
    const isSelected = selectedPaymentMethod === 'CASH';

    return (
        <Card className="shadow-lg border-0 bg-white">
            <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-800">
                    <CreditCard className="h-6 w-6 text-blue-600" />
                    طريقة الدفع
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* COD Payment Method */}
                <div
                    className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 ${isSelected
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/50'
                        }`}
                    onClick={() => onSelectPayment('CASH')}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onSelectPayment('CASH');
                        }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label="الدفع عند الاستلام"
                    aria-pressed={isSelected}
                >
                    {/* Mobile Layout */}
                    <div className="md:hidden text-center">
                        <h3 className="font-bold text-xl text-slate-800 mb-2">الدفع عند الاستلام</h3>
                        <p className="text-slate-600 mb-4">طريقة الدفع الأكثر أمانًا (كاش أو شبكة)</p>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden md:flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isSelected ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'
                                }`}>
                                <Banknote className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-slate-800">الدفع عند الاستلام</h3>
                                <p className="text-slate-600">طريقة الدفع الأكثر أمانًا (كاش أو شبكة)</p>
                            </div>
                        </div>
                        {isSelected && (
                            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-full">
                                <CheckCircle className="h-6 w-6" />
                            </div>
                        )}
                    </div>

                    {/* Benefits - Hidden on Mobile */}
                    <div className="hidden md:block mt-4 space-y-2">
                        {[
                            'ادفع بالضبط عند وصول الطلب',
                            'فحص المنتجات قبل الدفع',
                            'لا توجد رسوم إضافية'
                        ].map((benefit, index) => (
                            <div key={index} className="flex items-center gap-3 text-emerald-700">
                                <CheckCircle className="h-4 w-4" />
                                <span className="font-medium">{benefit}</span>
                            </div>
                        ))}
                    </div>

                    {/* Security Badges - Mobile */}
                    <div className="md:hidden flex justify-center gap-3 mt-4">
                        <div className="flex items-center gap-2 px-3 py-2 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-semibold">
                            <Shield className="h-4 w-4" />
                            <span>آمن 100%</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold">
                            <Lock className="h-4 w-4" />
                            <span>مشفر</span>
                        </div>
                    </div>

                    {/* Security Badges - Desktop */}
                    <div className="hidden md:flex gap-4 mt-4">
                        <div className="flex items-center gap-2 px-3 py-2 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-semibold">
                            <Shield className="h-4 w-4" />
                            <span>آمن 100%</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold">
                            <Lock className="h-4 w-4" />
                            <span>مشفر</span>
                        </div>
                    </div>
                </div>

                {/* Coming Soon Section - Hidden on Mobile */}
                <div className="hidden md:block space-y-4">
                    <h4 className="text-lg font-bold text-slate-700 text-center">طرق دفع إضافية (قريبًا)</h4>

                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { name: 'Mada', src: '/assets/mada.svg' },
                            { name: 'Mastercard', src: '/assets/Mastercard.svg' },
                            { name: 'Visa', src: '/assets/Visa.svg' }
                        ].map((card) => (
                            <div
                                key={card.name}
                                className="flex flex-col items-center p-4 bg-slate-100 rounded-xl border-2 border-slate-300 opacity-60"
                                aria-label={`${card.name} - متاحة قريباً`}
                                aria-disabled="true"
                            >
                                <Image
                                    src={card.src}
                                    alt={`${card.name} - Coming Soon`}
                                    width={40}
                                    height={30}
                                    className="object-contain grayscale mb-2"
                                />
                                <Badge variant="secondary" className="text-sm bg-slate-400 text-slate-700 mb-2">
                                    قريباً
                                </Badge>
                                <div className="flex items-center gap-1 text-sm text-slate-500">
                                    <Shield className="h-3 w-3" />
                                    <span>آمن</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-xl">
                        <p className="text-blue-700 font-medium">
                            🚀 نعمل على إضافة المزيد من طرق الدفع لراحتك
                        </p>
                    </div>
                </div>

                {/* Security Notice - Hidden on Mobile */}
                <div className="hidden md:block p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-3 mb-3">
                        <Lock className="h-5 w-5 text-blue-600" />
                        <span className="font-semibold text-slate-700">جميع المدفوعات آمنة ومشفرة</span>
                    </div>
                    <p className="text-sm text-slate-600">
                        نحن نستخدم أحدث تقنيات التشفير لحماية معلوماتك الشخصية وبيانات الدفع.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
} 