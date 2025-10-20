'use client';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icons/Icon';
import { downloadQRCode } from '../helpers/generateQR';
import { useState } from 'react';

interface QRDownloadButtonsProps {
  qrUrl: string | null;
  restaurantName: string;
}

export default function QRDownloadButtons({ qrUrl, restaurantName }: QRDownloadButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleDownloadPNG = () => {
    if (!qrUrl) return;
    downloadQRCode(qrUrl, `${restaurantName}-qr.png`);
  };

  const handleCopyLink = async () => {
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/restaurant-portal/qr-code`;

    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <Button
        onClick={handleDownloadPNG}
        disabled={!qrUrl}
        className="w-full"
        size="lg"
      >
        <Icon name="Download" className="h-5 w-5 mr-2" />
        تحميل PNG
      </Button>

      <Button
        onClick={handleCopyLink}
        variant="outline"
        className="w-full"
        size="lg"
      >
        <Icon name={copied ? "Check" : "Copy"} className="h-5 w-5 mr-2" />
        {copied ? 'تم النسخ!' : 'نسخ رابط الصفحة'}
      </Button>
    </div>
  );
}

