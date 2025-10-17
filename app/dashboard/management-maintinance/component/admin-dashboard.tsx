'use client';
// SaaS Admin/Owner Maintenance Dashboard
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/icons/Icon';
import { useState } from 'react';
import { refreshAllCaches } from '../../management/settings/actions/refreshCaches';
import { dbHealthCheck } from '../actions/dbHealthCheck';
import { pusherHealthCheck } from '../actions/pusherHealthCheck';
import { sendTestEmail } from '../actions/sendTestEmail';
import { getAtlasClusterInfo } from '../actions/getAtlasClusterInfo';
import { cloudinaryHealthCheck } from '../actions/cloudinaryHealthCheck';
import { whatsappCloudTest } from '../actions/whatsappTest';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { whatsappCheckCredentials } from '../actions/whatsappCheckCredentials';
import { Input } from '@/components/ui/input';
import { whatsappSalesTest } from '../actions/whatsappSalesTest';

export default function AdminMaintenanceDashboard() {
  const [refreshing, setRefreshing] = useState(false);
  const [refreshDone, setRefreshDone] = useState<'idle' | 'ok' | 'err'>('idle');
  const [dbLatency, setDbLatency] = useState<number | null>(null);
  const [dbName, setDbName] = useState<string | null>(null);
  const [dbPlan, setDbPlan] = useState<string | null>(null);
  const [atlasPlan, setAtlasPlan] = useState<string | null>(null);
  const [atlasProvider, setAtlasProvider] = useState<string | null>(null);
  const [pusherConfigured, setPusherConfigured] = useState<boolean | null>(null);
  const [missingKeys, setMissingKeys] = useState<string[]>([]);
  const [cloudStatus, setCloudStatus] = useState<'idle' | 'ok' | 'err'>('idle');
  const [cloudMsg, setCloudMsg] = useState<string>('');
  const [waOpen, setWaOpen] = useState(false);
  const [waTo, setWaTo] = useState('0502699023');
  const [waOtp, setWaOtp] = useState('123456');
  // Language is fixed to ar_SA per KSA default
  const [waInlineMsg, setWaInlineMsg] = useState<string | null>(null);
  const [waInlineOk, setWaInlineOk] = useState<boolean | null>(null);
  const [waTokenOk, setWaTokenOk] = useState<boolean | null>(null);
  const [waPhoneOk, setWaPhoneOk] = useState<boolean | null>(null);
  const [waKeyChecking, setWaKeyChecking] = useState(false);

  const handleRefreshHealth = async () => {
    setRefreshing(true);
    setRefreshDone('idle');
    const res = await refreshAllCaches();
    setRefreshing(false);
    setRefreshDone(res.ok ? 'ok' : 'err');
  };
  const handleCheckDb = async () => {
    const db = await dbHealthCheck();
    setDbLatency(db.ok ? db.latencyMs ?? null : null);
    setDbName(db.ok ? (db as any).dbName ?? null : null);
    setDbPlan(db.ok ? (db as any).plan ?? null : null);
    const atlas = await getAtlasClusterInfo();
    if (atlas.ok) {
      setAtlasPlan((atlas as any).instanceSizeName ?? null);
      setAtlasProvider((atlas as any).providerName ?? null);
    }
  };
  const handleCheckPusher = async () => {
    const p = await pusherHealthCheck();
    setPusherConfigured(p.ok && p.configured);
    setMissingKeys(Array.isArray((p as any).missing) ? (p as any).missing : []);
  };

  const handleTestCloudinary = async () => {
    setCloudStatus('idle');
    setCloudMsg('');
    const res = await cloudinaryHealthCheck();
    if (res.ok) {
      setCloudStatus('ok');
      setCloudMsg('تم التحقق من مفاتيح Cloudinary بنجاح');
    } else {
      setCloudStatus('err');
      setCloudMsg(res.message || 'فشل التحقق من Cloudinary');
    }
  };

  return (
    <div className="w-full py-10 space-y-8">
      <h1 className="text-3xl font-bold mb-6">لوحة صيانة النظام</h1>
      {/* Database Health */}
      <Card className="p-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Icon name="Database" className="text-purple-500" />
            صحة قاعدة البيانات
            <Badge color="success">{dbLatency !== null ? 'تم الفحص' : 'خامل'}</Badge>
          </div>
          <ul className="text-gray-500 text-sm mt-2 space-y-1 list-disc list-inside">
            <li>
              {dbLatency !== null ? (
                <>
                  زمن الاستجابة: <span className="font-medium">{dbLatency}ms</span>
                </>
              ) : (
                'اضغط فحص لعرض الحالة.'
              )}
            </li>
            {dbName && (
              <li>
                قاعدة البيانات:
                <Badge variant="secondary" className="ml-2 px-2 py-0.5 text-xs">{dbName}</Badge>
              </li>
            )}
            {(atlasPlan || dbPlan) && (
              <li>
                الخطة: <span className="font-medium">{atlasPlan ?? dbPlan}</span>
                {atlasProvider && <span className="ml-2">({atlasProvider})</span>}
              </li>
            )}
          </ul>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleCheckDb}>
            <Icon name="Info" className="mr-2" /> فحص
          </Button>
        </div>
      </Card>

      {/* Realtime (Pusher) Status */}
      <Card className="p-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Icon name="Radio" className="text-green-500" />
            الحالة الفورية (Pusher)
            <Badge color={pusherConfigured === false ? 'destructive' : 'success'}>
              {pusherConfigured === null ? 'خامل' : pusherConfigured ? 'مُفعّل' : 'غير مُعد'}
            </Badge>
            <Badge variant="secondary" className="px-2 py-0.5 text-[10px]">onProgress</Badge>
          </div>
          <div className="text-gray-500 text-sm mt-1">
            {pusherConfigured === null && 'اضغط فحص لعرض الحالة.'}
            {pusherConfigured === true && 'Pusher مُفعّل (مفاتيح البيئة موجودة).'}
            {pusherConfigured === false && (
              <span>
                Pusher غير مُعد، تحقق من مفاتيح البيئة.
                {missingKeys.length > 0 && (
                  <span className="ml-2">المفقود: <span className="font-medium">{missingKeys.join(', ')}</span></span>
                )}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleCheckPusher}>
            <Icon name="Info" className="mr-2" /> فحص
          </Button>
        </div>
      </Card>

      {/* Cache & Revalidation */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Icon name="RefreshCw" className="text-primary" />
            التخزين المؤقت وإعادة التحقق
          </div>
          <Button onClick={handleRefreshHealth} disabled={refreshing}>
            <Icon name="Bolt" className="mr-2" /> تحديث شامل
          </Button>
        </div>
        <div className="space-y-2">
          <div className="h-2 w-full rounded bg-neutral-200" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={refreshing ? 70 : refreshDone === 'ok' ? 100 : 0}>
            <div className={`h-2 rounded ${refreshDone === 'err' ? 'bg-red-500' : 'bg-primary'} transition-all duration-500`} style={{ width: `${refreshing ? 70 : refreshDone === 'ok' ? 100 : 0}%` }} />
          </div>
          <div className="text-sm text-muted-foreground">
            {refreshing && 'جاري التحديث…'}
            {refreshDone === 'ok' && 'تم التحديث بنجاح.'}
            {refreshDone === 'err' && 'فشل التحديث.'}
            {refreshDone === 'idle' && !refreshing && 'خامل'}
          </div>
        </div>
      </Card>

      {/* Cloudinary Status */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Icon name="Image" className="text-amber-600" />
            حالة الوسائط (Cloudinary)
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleTestCloudinary}>
              <Icon name="Info" className="mr-2" /> اختبار
            </Button>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          {cloudStatus === 'idle' && 'اختبر الاتصال للتأكد أن المفاتيح صحيحة.'}
          {cloudStatus === 'ok' && <span className="text-emerald-500">{cloudMsg}</span>}
          {cloudStatus === 'err' && <span className="text-red-500">{cloudMsg}</span>}
        </div>
      </Card>

      {/* WhatsApp Cloud API Test */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Icon name="MessageSquare" className="text-green-600" />
            اختبار WhatsApp Cloud API
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" disabled={waKeyChecking} onClick={async () => {
              try {
                setWaKeyChecking(true);
                setWaInlineMsg(null);
                const res = await whatsappCheckCredentials();
                if (res.ok) {
                  setWaInlineOk(true);
                  setWaInlineMsg(`Valid ✅ | Number: ${res.displayPhone ?? 'Unknown'}`);
                  setWaTokenOk(res.tokenPresent);
                  setWaPhoneOk(res.phoneIdPresent);
                } else {
                  const miss = res.missing?.length ? ` - مفقود: ${res.missing.join(', ')}` : '';
                  setWaInlineOk(false);
                  setWaInlineMsg(`خطأ المفاتيح (${res.status ?? ''}) ${res.message}${miss}`);
                  setWaTokenOk(res.tokenPresent ?? false);
                  setWaPhoneOk(res.phoneIdPresent ?? false);
                }
              } finally {
                setWaKeyChecking(false);
              }
            }}>
              {waKeyChecking ? (
                <span className="flex items-center">
                  <Icon name="RefreshCw" className="mr-2 animate-spin" /> يفحص...
                </span>
              ) : (
                'فحص المفاتيح'
              )}
            </Button>
            <Button onClick={() => setWaOpen(true)}>اختبار الـ OTP</Button>
            <Button variant="outline" onClick={async () => {
              const phone = (waTo && waTo.trim()) || '0502699023';
              await whatsappSalesTest(phone, 'A12345');
            }}>فحص Order Submit</Button>
          </div>
        </div>
        <div className="text-xs text-muted-foreground flex items-center gap-6">
          <span className="flex items-center gap-1">
            <Icon name={waTokenOk ? 'Check' : 'AlertTriangle'} className={`${waTokenOk === null ? 'text-muted-foreground' : waTokenOk ? 'text-emerald-500' : 'text-red-500'}`} />
            <span>WHATSAPP_ACCESS_TOKEN</span>
          </span>
          <span className="flex items-center gap-1">
            <Icon name={waPhoneOk ? 'Check' : 'AlertTriangle'} className={`${waPhoneOk === null ? 'text-muted-foreground' : waPhoneOk ? 'text-emerald-500' : 'text-red-500'}`} />
            <span>WHATSAPP_PHONE_NUMBER_ID</span>
          </span>
        </div>
        {waInlineMsg && (
          <div className={`mt-2 text-sm ${waInlineOk ? 'text-emerald-500' : 'text-red-500'}`}>{waInlineMsg}</div>
        )}
      </Card>

      <Dialog open={waOpen} onOpenChange={setWaOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>اختبار الـ OTP عبر واتساب</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <label className="text-sm">رقم واتساب الدولي</label>
            <Input placeholder="9665xxxxxxxx" value={waTo} onChange={(e) => setWaTo(e.target.value)} />
            <label className="text-sm">رمز OTP (اختياري)</label>
            <Input placeholder="123456" value={waOtp} onChange={(e) => setWaOtp(e.target.value)} />
            <span className="text-sm text-muted-foreground">اللغة: ar_SA (افتراضي للسعودية)</span>
            {waInlineMsg && (
              <div className={`text-sm ${waInlineOk ? 'text-emerald-500' : 'text-red-500'}`}>{waInlineMsg}</div>
            )}
          </div>
          <DialogFooter>
            <Button
              onClick={async () => {
                if (!waTo.trim()) return;
                setWaInlineMsg(null);
                setWaInlineOk(null);
                const res = await whatsappCloudTest(waTo.trim(), waOtp.trim() || '123456');
                if (res.ok) {
                  setWaInlineOk(true);
                  setWaInlineMsg(`تم الإرسال ✔️${res.id ? ` (ID: ${res.id})` : ''}`);
                } else {
                  const missing = res.missing?.length ? ` - مفقود: ${res.missing.join(', ')}` : '';
                  setWaInlineOk(false);
                  setWaInlineMsg(`فشل (${res.message})${missing}`);
                }
              }}
            >
              إرسال
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>



      {/* Email Test */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Icon name="Mail" className="text-emerald-600" />
            اختبار البريد
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={async () => {
              const to = prompt('أدخل بريداً لتجربة الإرسال:');
              if (!to) return;
              const res = await sendTestEmail(to);
              alert(res.ok ? 'تم الإرسال بنجاح' : `فشل: ${res.message}`);
            }}
          >
            إرسال بريد تجريبي
          </Button>
          <div className="text-xs text-muted-foreground">يحتاج EMAIL_USER/EMAIL_PASS مهيّأة في البيئة.</div>
        </div>
      </Card>

    </div>
  );
}
