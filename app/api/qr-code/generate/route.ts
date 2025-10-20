import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import db from '@/lib/prisma';
import QRCode from 'qrcode';
import { uploadImageToCloudinary } from '@/app/api/images/cloudinary/uploadImageToCloudinary';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { restaurantId, includeStats = false } = body;

    // Get restaurant by user ID if restaurantId is 'current' or not provided
    let restaurant;
    if (!restaurantId || restaurantId === 'current') {
      restaurant = await db.restaurant.findFirst({
        where: { userId: session.user.id },
        select: {
          id: true,
          slug: true,
          name: true,
          imageUrl: true,
          userId: true,
          qrScanCount: true,
          lastQrScan: true,
        }
      });
    } else {
      restaurant = await db.restaurant.findUnique({
        where: { id: restaurantId },
        select: {
          id: true,
          slug: true,
          name: true,
          imageUrl: true,
          userId: true,
          qrScanCount: true,
          lastQrScan: true,
        }
      });
    }

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    // Verify ownership
    if (restaurant.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized - not restaurant owner' },
        { status: 403 }
      );
    }

    // Generate QR code URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const qrUrl = `${baseUrl}/restaurant/${restaurant.slug}?ref=qr&qrid=${restaurant.id}`;

    // Generate QR code with high error correction (allows logo overlay)
    const qrDataUrl = await QRCode.toDataURL(qrUrl, {
      errorCorrectionLevel: 'H', // High error correction (30%)
      type: 'image/png',
      width: 512, // High resolution for printing
      margin: 4, // White border
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    // Upload to Cloudinary
    let cloudinaryUrl = qrDataUrl; // Fallback to data URL
    try {
      const uploadResult = await uploadImageToCloudinary(
        qrDataUrl,
        process.env.CLOUDINARY_UPLOAD_PRESET || 'E-comm',
        `qr-codes/${restaurant.slug}`
      );
      cloudinaryUrl = uploadResult.url;

      // Update restaurant with QR code URL
      await db.restaurant.update({
        where: { id: restaurant.id },
        data: {
          qrCodeUrl: cloudinaryUrl,
          qrCodeGenerated: new Date(),
        }
      });
    } catch (uploadError) {
      console.error('Cloudinary upload failed, using data URL:', uploadError);
    }

    // Prepare response
    const response: any = {
      qrCodeDataUrl: qrDataUrl,
      downloadUrl: cloudinaryUrl,
    };

    if (includeStats) {
      response.stats = {
        totalScans: restaurant.qrScanCount,
        lastScan: restaurant.lastQrScan,
      };
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('QR code generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}

