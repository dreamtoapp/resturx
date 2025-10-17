import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/prisma';

export async function GET(_request: NextRequest) {
  try {
    const company = await db.company.findFirst({
      select: {
        googleMapsApiKey: true,
      },
    });

    // Provide fallback values if Google Maps is not configured
    const googleMapsApiKey = company?.googleMapsApiKey || '';

    return NextResponse.json({
      googleMapsApiKey,
      isConfigured: !!company?.googleMapsApiKey,
    });
  } catch (error) {
    console.error('Error fetching Google Maps config:', error);
    // Return fallback values even on error
    return NextResponse.json({
      googleMapsApiKey: '',
      isConfigured: false,
    });
  }
}
