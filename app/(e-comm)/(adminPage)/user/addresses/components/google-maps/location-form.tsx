import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Heart, Save, Trash2 } from "lucide-react";
import { LocationFormProps } from './types';

// Location Form Component
export const LocationForm = ({
  selectedLocation,
  userLocation,
  title,
  setTitle,
  editableAddress,
  setEditableAddress,
  landmark,
  setLandmark,
  deliveryNote,
  setDeliveryNote,
  onSave,
  onClear
}: LocationFormProps) => {
  if (!selectedLocation) {
    return (
      <div className="flex items-center justify-center p-8 text-center">
        <div className="space-y-3">
          <div className="w-12 h-12 bg-muted/30 rounded-full flex items-center justify-center mx-auto">
            <MapPin className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">
            انقر على الخريطة لتحديد موقع العميل
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Selected Location Header */}
      <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
              <Heart className="h-3 w-3 text-primary" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">عنوان الموقع المحدد</h3>
          </div>
          <Badge variant="outline" className="text-xs font-mono">
            [{(selectedLocation?.lat ?? userLocation?.lat ?? 0).toFixed(6)}, {(selectedLocation?.lng ?? userLocation?.lng ?? 0).toFixed(6)}]
          </Badge>
        </div>
        {/* <p className="text-xs text-muted-foreground">
          تم تحديد هذا الموقع على الخريطة
        </p> */}
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        {/* Title Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            عنوان الموقع
          </label>
          <div className="relative">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={30}
              placeholder="مثال: المنزل، العمل، المستودع..."
              className="h-10 text-sm border-border/50 focus:border-primary/50 bg-background"
              dir="rtl"
            />
            <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
              <Badge variant="secondary" className="text-xs">
                {title.length}/30
              </Badge>
            </div>
          </div>
        </div>

        {/* Address Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            العنوان التفصيلي
          </label>
          <Input
            value={editableAddress}
            onChange={(e) => setEditableAddress(e.target.value)}
            placeholder="أدخل العنوان المطلوب"
            className="h-10 text-sm border-border/50 focus:border-primary/50 bg-background"
            dir="rtl"
          />
        </div>

        {/* Landmark Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            معلم قريب
          </label>
          <Input
            value={landmark}
            onChange={(e) => setLandmark(e.target.value)}
            placeholder="مثال: بجانب مسجد، مقابل بنك، أمام مدرسة..."
            className="h-10 text-sm border-border/50 focus:border-primary/50 bg-background"
            dir="rtl"
          />
        </div>

        {/* Delivery Note Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            ملاحظات التوصيل
          </label>
          <textarea
            value={deliveryNote}
            onChange={(e) => setDeliveryNote(e.target.value)}
            placeholder="مثال: الطابق الثالث، الشقة 301، اترك الطرد مع الجار..."
            className="w-full h-20 text-sm border border-border/50 focus:border-primary/50 bg-background rounded-md p-3 resize-none transition-colors duration-200 placeholder:text-muted-foreground/60"
            dir="rtl"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-4 border-t border-border/50">
        <Button
          variant="outline"
          onClick={onClear}
          disabled={!title && !landmark && !deliveryNote && !editableAddress}
          className="flex-1 h-10 text-sm font-medium transition-all duration-200 hover:bg-muted/50 hover:border-primary/30"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          مسح الحقول
        </Button>
        <Button
          onClick={onSave}
          disabled={!selectedLocation}
          className="flex-1 h-10 text-sm font-medium bg-primary hover:bg-primary/90 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <Save className="h-4 w-4 mr-2" />
          حفظ الموقع
        </Button>
      </div>
    </div>
  );
};


