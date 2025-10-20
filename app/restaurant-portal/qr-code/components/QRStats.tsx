'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@/components/icons/Icon';
import Link from '@/components/link';
import { Button } from '@/components/ui/button';

interface QRStatsProps {
  totalScans: number;
  todayScans: number;
  lastScan: Date | null;
}

export default function QRStats({ totalScans, todayScans, lastScan }: QRStatsProps) {
  const getRelativeTime = (date: Date | null) => {
    if (!date) return 'لم يتم المسح بعد';

    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'منذ لحظات';
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    if (hours < 24) return `منذ ${hours} ساعة`;
    return `منذ ${days} يوم`;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            إجمالي المسحات
          </CardTitle>
          <Icon name="QrCode" className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary">{totalScans}</div>
          <p className="text-xs text-muted-foreground mt-2">
            {todayScans} مسح اليوم
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            آخر مسح
          </CardTitle>
          <Icon name="Clock" className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-lg font-semibold">{getRelativeTime(lastScan)}</div>
        </CardContent>
      </Card>

      <Link href="/restaurant-portal/analytics" className="block">
        <Button variant="outline" className="w-full" size="lg">
          <Icon name="BarChart3" className="h-5 w-5 mr-2" />
          عرض التحليلات التفصيلية
        </Button>
      </Link>
    </div>
  );
}

