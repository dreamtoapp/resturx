'use client';


import { ImageIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import AddImage from '@/components/AddImage';
import { updateOfferBanner } from '../actions/update-banner';
import { toast } from 'sonner';

interface OfferBannerUploadProps {
    offerId: string;
    offerName: string;
    currentBannerUrl?: string | null;
    onUploadComplete?: (url: string) => void;
}

export function OfferBannerUpload({
    offerId,
    offerName,
    currentBannerUrl,
    onUploadComplete
}: OfferBannerUploadProps) {

    const handleBannerUpload = async (imageUrl: string) => {
        try {
            const result = await updateOfferBanner(offerId, imageUrl);
            if (result.success) {
                toast.success(result.message || 'تم تحديث صورة البانر بنجاح');
                onUploadComplete?.(imageUrl);
            }
        } catch (error) {
            console.error('Error updating banner:', error);
            toast.error('حدث خطأ أثناء تحديث صورة البانر');
        }
    };

    return (
        <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-muted/50">
            <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-8 items-center">
                    {/* Image Section */}
                    <div className="w-full lg:w-1/2 flex justify-center">
                        <div className="relative aspect-square w-full max-w-sm rounded-2xl border-2 border-border overflow-hidden bg-card shadow-xl">
                            <AddImage
                                url={currentBannerUrl || undefined}
                                alt={`صورة بانر ${offerName}`}
                                className="w-full h-full object-contain"
                                recordId={offerId}
                                table="offer"
                                tableField="bannerImage"
                                onUploadComplete={handleBannerUpload}
                                autoUpload={true}
                            />
                            {!currentBannerUrl && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-gradient-to-br from-muted/30 to-muted/50">
                                    <div className="text-center text-muted-foreground">
                                        <div className="p-4 bg-card rounded-full shadow-lg mb-4 mx-auto w-fit">
                                            <ImageIcon className="h-8 w-8 text-primary" />
                                        </div>
                                        <p className="text-sm font-semibold mb-1">انقر لإضافة صورة البانر</p>
                                        <p className="text-xs opacity-75">الأبعاد المثلى: 1200 × 400 بكسل</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="w-full lg:w-1/2 flex flex-col justify-center space-y-6">
                        {/* Header */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <ImageIcon className="h-5 w-5 text-primary" />
                                </div>
                                <h3 className="text-2xl font-bold text-foreground">
                                    صورة البانر
                                </h3>
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-lg font-semibold text-foreground">
                                    {offerName}
                                </h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    اختر صورة بانر جذابة وعالية الجودة لعرض المجموعة بشكل مميز ومهني
                                </p>
                            </div>
                        </div>

                        {/* Guidelines */}
                        <div className="space-y-3">
                            <h5 className="text-sm font-semibold text-foreground">إرشادات الصورة</h5>
                            <div className="space-y-2">
                                <div className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border">
                                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                                    <span className="text-sm text-muted-foreground">أبعاد مثلى: 400 × 400 بكسل</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                    <span className="text-sm text-muted-foreground">حد أقصى: 5 ميجابايت</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <span className="text-sm text-muted-foreground">الصيغ المدعومة: JPG, PNG, WebP</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 