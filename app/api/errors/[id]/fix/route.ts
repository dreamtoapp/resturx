import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import db from '@/lib/prisma';

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.role || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Mark error as fixed (RESOLVED status)
    const updatedError = await db.errorLog.update({
      where: { id },
      data: {
        status: 'RESOLVED',
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      error: updatedError
    });

  } catch (error) {
    console.error('Error marking error as fixed:', error);

    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json({ error: 'Error not found' }, { status: 404 });
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
