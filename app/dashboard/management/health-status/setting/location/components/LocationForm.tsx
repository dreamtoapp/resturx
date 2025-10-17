"use client";

import { useState } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, Loader2, MapPin, Navigation, Link } from "lucide-react";
import GoogleMapsLink from "@/components/GoogleMapsLink";
import LocationLinkExtractor from "@/components/ui/LocationLinkExtractor";
import { saveLocation } from "../actions/saveLocation";
import { z } from "zod";

// Zod schema for location only
const LocationSchema = z.object({
    id: z.string().optional(),
    address: z.string().min(5, 'العنوان مطلوب'),
    latitude: z.string().regex(
        /^-?([0-8]?[0-9](\.\d+)?|90(\.0+)?)$/,
        'خط العرض غير صالح'
    ),
    longitude: z.string().regex(
        /^-?((1[0-7][0-9]|[0-9]?[0-9])(\.\d+)?|180(\.0+)?)$/,
        'خط الطول غير صالح'
    ),
});

type LocationFormData = z.infer<typeof LocationSchema>;

interface LocationFormProps {
    company?: any;
    onProgressChange?: (current: number, total: number, isComplete: boolean) => void;
}

export default function LocationForm({ company, onProgressChange }: LocationFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
        reset,
        watch,
        setValue,
    } = useForm<LocationFormData>({
        resolver: zodResolver(LocationSchema),
        defaultValues: {
            id: company?.id || '',
            address: company?.address || '',
            latitude: company?.latitude || '',
            longitude: company?.longitude || '',
        },
    });

    const handleExtractCoordinates = (coords: { latitude: string; longitude: string }) => {
        setValue('latitude', coords.latitude);
        setValue('longitude', coords.longitude);
        toast.success(`تم استخراج الإحداثيات بنجاح: ${coords.latitude}, ${coords.longitude}`);
    };

    // Dynamically report progress to parent (top progress bar)
    useEffect(() => {
        const subscription = watch((values) => {
            const total = 3;
            const current = [values.address, values.latitude, values.longitude].filter(Boolean).length;
            onProgressChange?.(current, total, current === total);
        });
        return () => subscription.unsubscribe();
    }, [watch, onProgressChange]);

    const onSubmit = async (data: LocationFormData) => {
        setIsSubmitting(true);
        try {
            // Merge with existing company data to preserve other fields
            const updatedData = {
                ...company,
                ...data,
            };

            await saveLocation(updatedData as any);
            toast.success("تم حفظ معلومات الموقع بنجاح");
            reset(data); // Reset form with new values
        } catch (error) {
            console.error("❌ Failed to save location:", error);
            toast.error("حدث خطأ أثناء الحفظ، الرجاء المحاولة مرة أخرى.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6" dir="rtl">
            {/* Location Hint */}
            <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <div className="flex items-start gap-3">
                    <div className="p-1 bg-muted rounded-full">
                        <MapPin className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                        <h5 className="text-sm font-medium text-foreground mb-1">الموقع الفعلي للمتجر</h5>
                        <p className="text-xs text-muted-foreground">
                            أدخل العنوان الفعلي والإحداثيات الدقيقة لموقع متجرك المادي. هذا الموقع سيظهر للعملاء الذين يريدون زيارة متجرك شخصياً. عند إدخال الإحداثيات الصحيحة، ستظهر لك رابط لعرض الموقع على خرائط جوجل.
                        </p>
                    </div>
                </div>
            </div>

            {/* URL Extractor */}
            <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <div className="flex items-start gap-3">
                    <div className="p-1 bg-muted rounded-full">
                        <Link className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                        <h5 className="text-sm font-medium text-foreground mb-2">استخراج الإحداثيات من الرابط</h5>
                        <LocationLinkExtractor onExtract={handleExtractCoordinates} />
                    </div>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Address */}
                <div className={`rounded-lg border p-4 transition-colors ${watch('address')?.trim() ? 'bg-primary/5 border-primary' : 'bg-muted/20 border-destructive'}`}>
                    <div className="relative">
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <MapPin className="w-5 h-5 text-foreground" />
                        </div>
                        <Input
                            type="text"
                            placeholder="أدخل العنوان الكامل للمتجر"
                            {...register('address')}
                            className="text-right pr-12"
                            dir="rtl"
                            disabled={isSubmitting}
                        />
                    </div>
                    {errors.address && (
                        <div className="flex items-center gap-2 text-xs text-destructive mt-2">
                            <AlertCircle className="w-3 h-3" />
                            {errors.address.message}
                        </div>
                    )}
                </div>

                {/* Coordinates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Latitude */}
                    <div className={`rounded-lg border p-4 transition-colors ${watch('latitude')?.trim() ? 'bg-primary/5 border-primary' : 'bg-muted/20 border-destructive'}`}>
                        <div className="relative">
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <Navigation className="w-5 h-5 text-foreground" />
                            </div>
                            <Input
                                type="text"
                                placeholder="مثال: 24.7136"
                                {...register('latitude')}
                                className="text-right pr-12"
                                dir="rtl"
                                disabled={isSubmitting}
                            />
                        </div>
                        {errors.latitude && (
                            <div className="flex items-center gap-2 text-xs text-destructive mt-2">
                                <AlertCircle className="w-3 h-3" />
                                {errors.latitude.message}
                            </div>
                        )}
                    </div>

                    {/* Longitude */}
                    <div className={`rounded-lg border p-4 transition-colors ${watch('longitude')?.trim() ? 'bg-primary/5 border-primary' : 'bg-muted/20 border-destructive'}`}>
                        <div className="relative">
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <Navigation className="w-5 h-5 text-foreground" />
                            </div>
                            <Input
                                type="text"
                                placeholder="مثال: 46.6753"
                                {...register('longitude')}
                                className="text-right pr-12"
                                dir="rtl"
                                disabled={isSubmitting}
                            />
                        </div>
                        {errors.longitude && (
                            <div className="flex items-center gap-2 text-xs text-destructive mt-2">
                                <AlertCircle className="w-3 h-3" />
                                {errors.longitude.message}
                            </div>
                        )}
                    </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-between items-center pt-4 border-t">
                    {/* Google Maps Link */}
                    {(() => {
                        const lat = parseFloat((watch('latitude') ?? '').toString());
                        const lng = parseFloat((watch('longitude') ?? '').toString());
                        const valid = Number.isFinite(lat) && Number.isFinite(lng);
                        return valid ? (
                            <GoogleMapsLink latitude={lat} longitude={lng} label="عرض الموقع على الخريطة" showIcon showExternalIcon />
                        ) : null;
                    })()}

                    {/* Save Button */}
                    <Button
                        type="submit"
                        disabled={isSubmitting || !isDirty}
                        className="min-w-[120px]"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                جارٍ الحفظ...
                            </>
                        ) : (
                            'حفظ الموقع'
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
} 