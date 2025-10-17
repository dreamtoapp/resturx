'use client';

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

import { User, Phone, AlertTriangle, CheckCircle, Edit2, Shield, Lock, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import Link from '@/components/link';

export interface UserProfile {
    id: string;
    name?: string | null;
    phone?: string | null;
    isOtp?: boolean | null;
    email?: string | null;
}

interface UserInfoCardProps {
    user: UserProfile;
    requireOtp?: boolean;
}

export default function UserInfoCard({ user, requireOtp }: UserInfoCardProps) {
    // Validation logic for each field
    const otpRequired = requireOtp !== false;
    const locationNotVerified = otpRequired && user?.isOtp !== true;
    const missingPhone = !user?.phone;

    // الآن نركز على البيانات الأساسية فقط، العناوين ستتم إدارتها في AddressBook
    const isValid = !missingPhone && !locationNotVerified;

    // State for collapsible - start closed if user data is complete, open if incomplete
    const [isOpen, setIsOpen] = useState(!isValid);

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <Card className="relative shadow-lg border bg-white hover:shadow-xl transition-shadow duration-200">

                {/* Status indicator bar */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${isValid
                    ? 'from-emerald-400 via-emerald-500 to-emerald-600'
                    : 'from-amber-400 via-amber-500 to-amber-600'
                    }`} />

                <CollapsibleTrigger asChild>
                    <CardHeader className="pb-5 sm:pb-6 relative cursor-pointer hover:bg-gray-50 transition-colors duration-150">
                        <CardTitle className="flex items-center w-full text-lg sm:text-2xl font-extrabold text-slate-800">
                            <div className={`p-2 rounded-xl sm:p-2.5 ${isValid
                                ? 'bg-emerald-100 text-emerald-600'
                                : 'bg-blue-100 text-blue-600'
                                }`}>
                                <User className="h-6 w-6 sm:h-7 sm:w-7" />
                            </div>
                            <span className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mr-2 sm:mr-3">
                                {user?.name || 'بيانات العميل'}
                            </span>

                            {/* Spacer to push badges and button to the end */}
                            <div className="flex-1"></div>

                            {/* Status badge beside collapse button */}
                            <div className="flex items-center gap-2">
                                {isValid && (
                                    <div className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-xs sm:text-base font-semibold">
                                        <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                        مكتمل
                                    </div>
                                )}

                                {/* Collapsible indicator */}
                                <div className="p-1.5 sm:p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors duration-150">
                                    {isOpen ? (
                                        <ChevronUp className="h-4 w-4" />
                                    ) : (
                                        <ChevronDown className="h-4 w-4" />
                                    )}
                                </div>
                            </div>
                        </CardTitle>
                    </CardHeader>
                </CollapsibleTrigger>

                <CollapsibleContent>
                    <CardContent className="space-y-5 sm:space-y-6 relative">
                        <div className="space-y-5">
                            {/* Phone Field */}
                            <div className="flex items-center justify-between p-3 sm:p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors duration-150">
                                <div className="flex items-center gap-3">
                                    <div className="p-1.5 sm:p-2 bg-green-100 text-green-600 rounded-lg">
                                        <Phone className="h-4 w-4" />
                                    </div>
                                    <span className="text-sm sm:text-base font-semibold text-slate-600">الهاتف:</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`text-sm sm:text-base font-bold px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full ${missingPhone
                                        ? 'bg-red-100 text-red-700 border border-red-200'
                                        : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                        }`}>
                                        {user?.phone || 'غير مكتمل'}
                                    </span>
                                    {!missingPhone && (
                                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                                    )}
                                </div>
                            </div>

                            {/* Account Verification */}
                            <div className="flex items-center justify-between p-3 sm:p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors duration-150">
                                <div className="flex items-center gap-3">
                                    <div className="p-1.5 sm:p-2 bg-purple-100 text-purple-600 rounded-lg">
                                        <Shield className="h-4 w-4" />
                                    </div>
                                    <span className="text-sm sm:text-base font-semibold text-slate-600">تفعيل الحساب:</span>
                                </div>
                                {otpRequired && locationNotVerified ? (
                                    <Link
                                        href="/auth/verify?redirect=/checkout"
                                        className="inline-flex items-center gap-2 px-2.5 py-1 sm:px-3 sm:py-1.5 bg-amber-100 text-amber-700 border border-amber-200 rounded-full text-sm sm:text-base font-medium hover:bg-amber-200 transition-colors duration-200"
                                    >
                                        <AlertTriangle className="h-3 w-3" />
                                        غير مفعل - انقر للتفعيل
                                    </Link>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <span className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full text-sm sm:text-base font-semibold">
                                            {otpRequired ? 'مفعل' : 'غير مطلوب'}
                                        </span>
                                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                                    </div>
                                )}
                            </div>

                            {/* Status Section */}
                            <div className="mt-6">
                                {!isValid ? (
                                    <div className="space-y-4">
                                        <div className="p-3 sm:p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl">
                                            <div className="flex items-start gap-3">
                                                <div className="p-1.5 sm:p-2 bg-amber-100 text-amber-600 rounded-lg flex-shrink-0">
                                                    <AlertTriangle className="h-5 w-5" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-base sm:text-lg text-amber-800 mb-1">تحسين مطلوب</h4>
                                                    <p className="text-sm sm:text-base text-amber-700 leading-relaxed font-medium">
                                                        من الأفضل إكمال بياناتك الشخصية لتحسين تجربة التوصيل وضمان دقة المعلومات.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <Button
                                            asChild
                                            variant="outline"
                                            className="w-full h-11 sm:h-12 bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-300 text-amber-800 hover:from-amber-100 hover:to-yellow-100 hover:border-amber-400 transition-all duration-200 font-semibold"
                                        >
                                            <Link href="/user/profile?redirect=/checkout">
                                                <Edit2 className="h-4 w-4 ml-2" />
                                                إكمال الملف الشخصي
                                            </Link>
                                        </Button>

                                        <div className="text-center">
                                            <p className="text-xs sm:text-sm text-slate-500 bg-slate-100 px-3 py-2 rounded-lg font-medium">
                                                ملاحظة: العناوين ستتم إدارتها في قسم &quot;عنوان التوصيل&quot; أدناه
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-3 sm:p-4 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
                                                <Sparkles className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-base sm:text-lg text-emerald-800 mb-1">ممتاز!</h4>
                                                <p className="text-sm sm:text-base text-emerald-700 font-medium">
                                                    جميع البيانات مكتملة ومفعلة. يمكنك المتابعة بأمان.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Security Note */}
                            <div className="flex items-center gap-3 pt-4 text-sm sm:text-base text-slate-600 border-t border-slate-200">
                                <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">
                                    <Lock className="h-3.5 w-3.5" />
                                </div>
                                <span className="font-semibold">معلوماتك آمنة ومشفرة</span>
                            </div>
                        </div>
                    </CardContent>
                </CollapsibleContent>
            </Card>
        </Collapsible>
    );
} 