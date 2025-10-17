"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { AlertCircle, Loader2, Save, Search } from "lucide-react";
import { saveCompany } from "../actions/saveCompany";
import { z } from "zod";

const BIO_MAX = 300;

// Zod schema for company profile only
const CompanyProfileSchema = z.object({
    id: z.string().optional(),
    fullName: z.string().min(2, 'اسم المتجر مطلوب'),
    email: z.string().email('صيغة البريد الإلكتروني غير صحيحة'),
    phoneNumber: z.string().min(8, 'رقم الهاتف مطلوب'),
    whatsappNumber: z.string().min(8, 'رقم الواتساب مطلوب'),
    bio: z.string().max(BIO_MAX, `الحد الأقصى ${BIO_MAX} حرف`).optional(),
});

type CompanyProfileFormData = z.infer<typeof CompanyProfileSchema>;

interface CompanyProfileFormProps {
    company?: any;
    onProgressChange?: (current: number, total: number, isComplete: boolean) => void;
}

export default function CompanyProfileForm({ company, onProgressChange }: CompanyProfileFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
        reset,
        watch,
    } = useForm<CompanyProfileFormData>({
        resolver: zodResolver(CompanyProfileSchema),
        defaultValues: {
            id: company?.id || '',
            fullName: company?.fullName || '',
            email: company?.email || '',
            phoneNumber: company?.phoneNumber || '',
            whatsappNumber: company?.whatsappNumber || '',
            bio: company?.bio || '',
        },
    });

    const bioValue = watch('bio') || '';


    // Report progress to parent (top progress bar)
    useEffect(() => {
        const subscription = watch((vals) => {
            const total = 3;
            const current = [vals.fullName, vals.email, vals.phoneNumber].filter(Boolean).length;
            onProgressChange?.(current, total, current === total);
        });
        return () => subscription.unsubscribe();
    }, [watch, onProgressChange]);

    const onSubmit = async (data: CompanyProfileFormData) => {
        setIsSubmitting(true);
        try {
            // Merge with existing company data to preserve other fields
            const updatedData = {
                ...company,
                ...data,
            };

            await saveCompany(updatedData);
            toast.success("تم حفظ معلومات المتجر بنجاح ✅");
            reset(data); // Reset form with new values
        } catch (error) {
            console.error("❌ Failed to save company profile:", error);
            toast.error("حدث خطأ أثناء الحفظ، الرجاء المحاولة مرة أخرى.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                        id="fullName"
                        type="text"
                        label="اسم المتجر *"
                        placeholder="أدخل اسم المتجر"
                        register={{ ...register('fullName') }}
                        error={errors.fullName?.message as string | undefined}
                    />

                    <InputField
                        id="email"
                        type="email"
                        label="البريد الإلكتروني *"
                        placeholder="أدخل البريد الإلكتروني"
                        register={{ ...register('email') }}
                        error={errors.email?.message as string | undefined}
                    />

                    <InputField
                        id="phoneNumber"
                        type="tel"
                        label="رقم الهاتف *"
                        placeholder="أدخل رقم الهاتف"
                        register={{ ...register('phoneNumber') }}
                        error={errors.phoneNumber?.message as string | undefined}
                    />

                    <InputField
                        id="whatsappNumber"
                        type="tel"
                        label="رقم الواتساب *"
                        placeholder="أدخل رقم الواتساب"
                        register={{ ...register('whatsappNumber') }}
                        hint="مثال: +966501234567 أو 0501234567"
                        error={errors.whatsappNumber?.message as string | undefined}
                    />
                </div>

                {/* Company Bio */}
                <TextareaField
                    id="bio"
                    label="نبذة عن المتجر (اختياري)"
                    placeholder="أدخل نبذة مختصرة عن شركتك"
                    register={{ ...register('bio') }}
                    error={errors.bio?.message as string | undefined}
                    hint="اكتب وصفًا موجزًا وجذابًا يتضمن كلمات رئيسية عن نشاطك لتحسين الظهور في محركات البحث."
                    valueLength={bioValue.length}
                    maxLength={BIO_MAX}
                />

                {/* Form Actions */}
                <div className="flex gap-4   justify-end">
                    <Button
                        type="submit"
                        disabled={isSubmitting || !isDirty}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                                جاري الحفظ...
                            </>
                        ) : (
                            <>
                                حفظ المعلومات
                                <Save className="w-4 h-4 ml-2" />
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}

// Internal small components (same file)
interface InputFieldProps {
    id: string;
    type: string;
    label: string;
    placeholder?: string;
    register: any;
    error?: string;
    hint?: string;
}

function InputField({ id, type, label, placeholder, register, error, hint }: InputFieldProps) {
    return (
        <div className="space-y-3">
            <Label htmlFor={id} className="text-sm font-medium text-right block">
                {label}
            </Label>
            <Input id={id} type={type} placeholder={placeholder} {...register} className="text-right" dir="rtl" />
            {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
            {error && (
                <div className="flex items-center gap-2 text-xs text-destructive">
                    <AlertCircle className="w-3 h-3" />
                    {error}
                </div>
            )}
        </div>
    );
}

interface TextareaFieldProps {
    id: string;
    label: string;
    placeholder?: string;
    register: any;
    error?: string;
    hint?: string;
    valueLength?: number;
    maxLength?: number;
}

function TextareaField({ id, label, placeholder, register, error, hint, valueLength, maxLength }: TextareaFieldProps) {
    return (
        <div className="space-y-3">
            <Label htmlFor={id} className="text-sm font-medium text-right block">
                {label}
            </Label>
            <Textarea
                id={id}
                placeholder={placeholder}
                {...register}
                className="text-right min-h-[100px]"
                dir="rtl"
                maxLength={maxLength}
                aria-describedby={`${id}-hint ${id}-counter`}
            />
            {(hint || typeof valueLength === 'number') && (
                <div className="flex items-center justify-between text-xs mt-1">
                    {hint ? (
                        <div id={`${id}-hint`} className="flex items-center gap-2 text-muted-foreground">
                            <Search className="w-3 h-3" />
                            <p>{hint}</p>
                        </div>
                    ) : <span />}
                    {typeof valueLength === 'number' && (
                        <div
                            id={`${id}-counter`}
                            className={valueLength >= (maxLength ?? Infinity) ? 'text-destructive' : 'text-muted-foreground'}
                        >
                            {maxLength ? `${valueLength}/${maxLength}` : `${valueLength}`} حرف
                        </div>
                    )}
                </div>
            )}
            {error && (
                <div className="flex items-center gap-2 text-xs text-destructive">
                    <AlertCircle className="w-3 h-3" />
                    {error}
                </div>
            )}
        </div>
    );
}