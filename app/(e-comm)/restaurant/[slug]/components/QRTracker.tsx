'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

interface QRTrackerProps {
  restaurantId: string;
}

export default function QRTracker({ restaurantId }: QRTrackerProps) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const isQrScan = searchParams.get('ref') === 'qr';
    const qrRestaurantId = searchParams.get('qrid');

    if (isQrScan && (qrRestaurantId === restaurantId || !qrRestaurantId)) {
      // Track the QR scan
      fetch('/api/qr-code/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ restaurantId }),
      }).catch(err => {
        console.error('Failed to track QR scan:', err);
      });
    }
  }, [searchParams, restaurantId]);

  return null; // This component doesn't render anything
}

