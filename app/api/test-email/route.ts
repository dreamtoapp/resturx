import { NextRequest, NextResponse } from 'next/server';
import { sendErrorNotificationEmail } from '@/helpers/system-error-email';

export async function POST(_request: NextRequest) {
  try {
    console.log('🧪 Testing email configuration...');
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '***SET***' : 'NOT SET');
    console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL);

    // Test email with minimal data
    const testResult = await sendErrorNotificationEmail({
      errorId: 'TEST-EMAIL-' + Date.now(),
      message: '🧪 Test email from myShop-DreamToApp system',
      stack: 'Test stack trace for debugging',
      url: 'http://localhost:3000/api/test-email',
      userAgent: 'Test User Agent',
      userId: 'test-user-123',
      severity: 'MEDIUM',
      timestamp: new Date().toLocaleString()
    });

    if (testResult) {
      console.log('✅ Test email sent successfully');
      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully',
        config: {
          emailUser: process.env.EMAIL_USER,
          adminEmail: process.env.ADMIN_EMAIL,
          emailPassSet: !!process.env.EMAIL_PASS
        }
      });
    } else {
      console.log('❌ Test email failed');
      return NextResponse.json({
        success: false,
        message: 'Test email failed to send',
        config: {
          emailUser: process.env.EMAIL_USER,
          adminEmail: process.env.ADMIN_EMAIL,
          emailPassSet: !!process.env.EMAIL_PASS
        }
      });
    }

  } catch (error) {
    console.error('❌ Test email error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      config: {
        emailUser: process.env.EMAIL_USER,
        adminEmail: process.env.ADMIN_EMAIL,
        emailPassSet: !!process.env.EMAIL_PASS
      }
    }, { status: 500 });
  }
}
