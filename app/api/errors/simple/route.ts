import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import db from '@/lib/prisma';

export async function GET(_request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.role || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all errors (no pagination, no complex filtering)
    const errors = await db.errorLog.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    // Add resolved field based on status
    const errorsWithResolved = errors.map(error => ({
      ...error,
      resolved: error.status === 'RESOLVED' || error.status === 'IGNORED'
    }));

    return NextResponse.json({
      errors: errorsWithResolved
    });

  } catch (error) {
    console.error('Error fetching errors:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
