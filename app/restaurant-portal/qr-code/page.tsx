'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@/components/icons/Icon';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import QRPreview from './components/QRPreview';
import QRDownloadButtons from './components/QRDownloadButtons';
import QRStats from './components/QRStats';

export default function QRCodePage() {
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [regenerating, setRegenerating] = useState(false);
  const [stats, setStats] = useState({ totalScans: 0, todayScans: 0, lastScan: null });

  const loadQRCode = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get restaurant ID from current user
      const response = await fetch('/api/qr-code/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantId: 'current', // Will be handled by API using session
          includeStats: true
        }),
      });

      if (!response.ok) {
        throw new Error('فشل إنشاء رمز QR');
      }

      const data = await response.json();
      setQrUrl(data.qrCodeDataUrl);

      if (data.stats) {
        setStats({
          totalScans: data.stats.totalScans || 0,
          todayScans: 0,
          lastScan: data.stats.lastScan,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
      setRegenerating(false);
    }
  };

  const handleRegenerate = async () => {
    setRegenerating(true);
    await loadQRCode();
  };

  useEffect(() => {
    loadQRCode();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text flex items-center gap-3">
          <Icon name="QrCode" className="h-8 w-8" />
          رمز QR للمطعم
        </h1>
        <p className="text-muted-foreground text-base lg:text-lg">
          رمز QR الخاص بمطعمك يمكن للعملاء مسحه للوصول إلى صفحة المطعم
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* QR Code Preview */}
        <div className="space-y-4">
          <QRPreview
            qrUrl={qrUrl}
            loading={loading}
            error={error || undefined}
            restaurantName="مطعمك"
          />

          <QRDownloadButtons
            qrUrl={qrUrl}
            restaurantName="مطعمك"
          />

          <Button
            onClick={handleRegenerate}
            disabled={regenerating || loading}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <Icon name={regenerating ? "Loader2" : "RefreshCw"} className={`h-5 w-5 mr-2 ${regenerating ? 'animate-spin' : ''}`} />
            {regenerating ? 'جاري إعادة الإنشاء...' : 'إعادة إنشاء QR'}
          </Button>
        </div>

        {/* Stats & Info */}
        <div className="space-y-4">
          <QRStats
            totalScans={stats.totalScans}
            todayScans={stats.todayScans}
            lastScan={stats.lastScan}
          />
        </div>
      </div>

      {/* Usage Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Lightbulb" className="h-5 w-5 text-yellow-500" />
            نصائح الاستخدام
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <Alert>
              <Icon name="Printer" className="h-4 w-4" />
              <AlertDescription>
                <strong>اطبع الرمز على قوائم الطعام</strong>
                <br />
                <span className="text-sm text-muted-foreground">
                  اطبع رمز QR على قوائم الطعام ليسهل على العملاء الوصول لقائمتك الرقمية
                </span>
              </AlertDescription>
            </Alert>

            <Alert>
              <Icon name="Store" className="h-4 w-4" />
              <AlertDescription>
                <strong>ضعه على واجهة المطعم</strong>
                <br />
                <span className="text-sm text-muted-foreground">
                  اطبع ملصق كبير وضعه على واجهة المطعم أو بالقرب من المدخل
                </span>
              </AlertDescription>
            </Alert>

            <Alert>
              <Icon name="Share2" className="h-4 w-4" />
              <AlertDescription>
                <strong>شاركه على وسائل التواصل</strong>
                <br />
                <span className="text-sm text-muted-foreground">
                  انشر رمز QR على حساباتك في Instagram و Facebook
                </span>
              </AlertDescription>
            </Alert>

            <Alert>
              <Icon name="ShoppingBag" className="h-4 w-4" />
              <AlertDescription>
                <strong>أضفه على أكياس التوصيل</strong>
                <br />
                <span className="text-sm text-muted-foreground">
                  اطبع ملصق صغير على أكياس التوصيل لتشجيع الطلبات المستقبلية
                </span>
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

