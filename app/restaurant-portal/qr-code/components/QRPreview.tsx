'use client';

import Image from 'next/image';
import { Icon } from '@/components/icons/Icon';
import { Card, CardContent } from '@/components/ui/card';

interface QRPreviewProps {
  qrUrl: string | null;
  loading: boolean;
  error?: string;
  restaurantName: string;
}

export default function QRPreview({ qrUrl, loading, error, restaurantName }: QRPreviewProps) {
  if (loading) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
          <div className="animate-spin">
            <Icon name="Loader2" className="h-12 w-12 text-primary" />
          </div>
          <p className="text-muted-foreground">جاري إنشاء رمز QR...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-md border-destructive">
        <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
          <Icon name="AlertCircle" className="h-12 w-12 text-destructive" />
          <p className="text-destructive text-center">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!qrUrl) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
          <Icon name="QrCode" className="h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground">لا يوجد رمز QR</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardContent className="p-6">
        <div className="relative aspect-square w-full bg-white rounded-lg overflow-hidden shadow-inner">
          <Image
            src={qrUrl}
            alt={`رمز QR لمطعم ${restaurantName}`}
            fill
            className="object-contain p-4"
            priority
          />
        </div>
      </CardContent>
    </Card>
  );
}

