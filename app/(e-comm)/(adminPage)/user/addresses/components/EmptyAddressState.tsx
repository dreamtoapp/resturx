import { Card, CardContent } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Truck, Clock, Shield, Plus } from 'lucide-react';

interface EmptyAddressStateProps {
  onAddAddress: () => void;
}

export default function EmptyAddressState({ onAddAddress: _onAddAddress }: EmptyAddressStateProps) {
  return (
    <Card className="text-center py-12 border-2 border-dashed border-muted-foreground/20 hover:border-primary/30 transition-colors duration-300">
      <CardContent className="space-y-6">
        {/* Enhanced Icon Section */}
        <div className="relative">
          <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto mb-4">
            <MapPin className="h-12 w-12 text-primary" />
          </div>
          <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-1">
            <Plus className="h-4 w-4" />
          </div>
        </div>

        {/* Enhanced Title and Description */}
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-foreground">لا توجد عناوين محفوظة</h3>
          <p className="text-muted-foreground text-base max-w-md mx-auto leading-relaxed">
            أضف عنوانك الأول لتسهيل عملية التوصيل والحصول على تجربة تسوق أفضل
          </p>
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
          <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-muted/30">
            <Truck className="h-6 w-6 text-primary" />
            <span className="text-sm font-medium text-foreground">توصيل سريع</span>
            <span className="text-xs text-muted-foreground text-center">توصيل أسرع وأكثر دقة</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-muted/30">
            <Clock className="h-6 w-6 text-primary" />
            <span className="text-sm font-medium text-foreground">توصيل دقيق</span>
            <span className="text-xs text-muted-foreground text-center">توصيل دقيق إلى العنوان المحدد</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-muted/30">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-sm font-medium text-foreground">أمان كامل</span>
            <span className="text-xs text-muted-foreground text-center">حماية بياناتك الشخصية</span>
          </div>
        </div>

        {/* Enhanced CTA Button */}
        {/* <div className="pt-4">
          <Button 
            onClick={onAddAddress} 
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 px-8 py-3 rounded-lg font-medium text-base"
            size="lg"
          >
            <Plus className="h-5 w-5" />
            إضافة عنوان جديد
          </Button>
        </div> */}

        {/* Additional Info */}
        <div className="pt-4">
          <Badge variant="outline" className="text-xs">
            يمكنك إضافة عدة عناوين لتسهيل عملية الطلب
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}














