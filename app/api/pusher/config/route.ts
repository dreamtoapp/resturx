import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/prisma';

export async function GET(_request: NextRequest) {
  try {
    const company = await db.company.findFirst({
      select: {
        pusherKey: true,
        pusherCluster: true,
      },
    });

    // Provide fallback values if Pusher is not configured
    const pusherKey = company?.pusherKey || '';
    const pusherCluster = company?.pusherCluster || 'mt1';

    return NextResponse.json({
      pusherKey,
      pusherCluster,
      isConfigured: !!(company?.pusherKey && company?.pusherCluster),
    });
  } catch (error) {
    console.error('Error fetching Pusher config:', error);
    // Return fallback values even on error
    return NextResponse.json({
      pusherKey: '',
      pusherCluster: 'mt1',
      isConfigured: false,
    });
  }
}
