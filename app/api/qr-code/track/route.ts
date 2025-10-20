import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { restaurantId } = body;

    if (!restaurantId) {
      return NextResponse.json(
        { error: 'Restaurant ID is required' },
        { status: 400 }
      );
    }

    // Extract metadata from headers
    const ipAddress = req.headers.get('x-forwarded-for') ||
      req.headers.get('x-real-ip') ||
      'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';
    const referrer = req.headers.get('referer') || null;

    // Check if this IP already scanned recently (prevent spam)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentScan = await db.qRCodeScan.findFirst({
      where: {
        restaurantId,
        ipAddress,
        scannedAt: {
          gte: oneHourAgo
        }
      }
    });

    // If already scanned within the hour, don't record again
    if (recentScan) {
      return NextResponse.json({
        success: true,
        message: 'Already tracked recently'
      });
    }

    // Record the scan
    await db.qRCodeScan.create({
      data: {
        restaurantId,
        ipAddress,
        userAgent,
        referrer,
        scannedAt: new Date(),
      }
    });

    // Update restaurant counters
    await db.restaurant.update({
      where: { id: restaurantId },
      data: {
        qrScanCount: {
          increment: 1
        },
        lastQrScan: new Date(),
      }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('QR scan tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track scan' },
      { status: 500 }
    );
  }
}

