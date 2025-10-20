import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@/components/icons/Icon';

export default async function RestaurantAnalyticsPage() {
  const session = await auth();

  if (!session) {
    redirect('/auth/login');
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
          تحليلات المطعم 📊
        </h1>
        <p className="text-muted-foreground text-base lg:text-lg">
          إحصائيات وتحليلات أداء مطعمك
        </p>
      </div>

      {/* Coming Soon Card */}
      <Card className="shadow-lg border-2 border-dashed">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-950 flex items-center justify-center">
              <Icon name="BarChart3" className="h-10 w-10 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <CardTitle className="text-2xl">قريباً...</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4 pb-8">
          <p className="text-muted-foreground text-lg">
            سيتم إضافة التحليلات التفصيلية قريباً
          </p>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <div className="flex items-center justify-center gap-2">
              <Icon name="Users" className="h-4 w-4" />
              <span>إحصائيات الزوار</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Icon name="TrendingUp" className="h-4 w-4" />
              <span>تحليل الأداء</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Icon name="Eye" className="h-4 w-4" />
              <span>مشاهدات الصفحة</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Icon name="Heart" className="h-4 w-4" />
              <span>الأطباق الأكثر شعبية</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Placeholder Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-dashed border-2 opacity-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">إجمالي الزوار</CardTitle>
            <Icon name="Users" className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">---</div>
            <p className="text-xs text-muted-foreground mt-2">قريباً</p>
          </CardContent>
        </Card>

        <Card className="border-dashed border-2 opacity-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">مشاهدات الصفحة</CardTitle>
            <Icon name="Eye" className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">---</div>
            <p className="text-xs text-muted-foreground mt-2">قريباً</p>
          </CardContent>
        </Card>

        <Card className="border-dashed border-2 opacity-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">معدل التحويل</CardTitle>
            <Icon name="TrendingUp" className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">---</div>
            <p className="text-xs text-muted-foreground mt-2">قريباً</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

