import db from '@/lib/prisma';

export interface QRStats {
  totalScans: number;
  lastScan: Date | null;
  todayScans: number;
}

export async function getQRStats(restaurantId: string): Promise<QRStats> {
  const restaurant = await db.restaurant.findUnique({
    where: { id: restaurantId },
    select: {
      qrScanCount: true,
      lastQrScan: true,
    }
  });

  // Get today's scans
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayScans = await db.qRCodeScan.count({
    where: {
      restaurantId,
      scannedAt: {
        gte: today
      }
    }
  });

  return {
    totalScans: restaurant?.qrScanCount || 0,
    lastScan: restaurant?.lastQrScan || null,
    todayScans,
  };
}

export function downloadQRCode(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

