import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Test API route working',
    timestamp: new Date().toISOString()
  });
}














