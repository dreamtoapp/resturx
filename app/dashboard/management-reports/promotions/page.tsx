import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@/components/icons/Icon';

export default function PromotionsReportPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6" dir="rtl">
      <div className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl text-foreground">
          تقرير العروض والتخفيضات
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          تقييم أداء الحملات الترويجية وتأثيرها على المبيعات
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold text-primary">
              العروض النشطة
            </CardTitle>
            <Icon name="Gift" className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              عدد العروض الترويجية النشطة حالياً
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold text-primary">
              تأثير العروض
            </CardTitle>
            <Icon name="TrendingUp" className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              تحليل تأثير العروض على زيادة المبيعات
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold text-primary">
              إحصائيات العروض
            </CardTitle>
            <Icon name="BarChart3" className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              إحصائيات مفصلة عن أداء العروض الترويجية
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


























