'use server';

import db from '@/lib/prisma';
import { sendOTPTemplate } from '@/lib/whatsapp/send-otp-template';

export async function sendPasswordViaWhatsApp(phoneNumber: string, _userName: string) {
  try {
    console.log('📱 Starting WhatsApp password delivery for:', phoneNumber);

    // Get current user with password from database
    const user = await db.user.findFirst({
      where: { phone: phoneNumber },
      select: { id: true, phone: true, name: true, password: true }
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (!user.password) {
      throw new Error('User has no password set');
    }

    console.log('✅ Found user with existing password');

    // TEMPORARY: Test with confirm template using a test number
    // Your template expects a number, not a password
    const testNumber = '1234'; // Test number that matches template variable

    console.log('🧪 TESTING: Using test number for confirm template:', testNumber);
    console.log('🧪 REAL password from DB:', user.password);

    // Use existing WhatsApp template to send test number
    const whatsappResult = await sendOTPTemplate(phoneNumber, testNumber);

    if (!whatsappResult.success) {
      console.error('❌ WhatsApp template failed:', whatsappResult.error);
      return {
        success: false,
        message: 'فشل في إرسال كلمة المرور عبر الواتس اب',
        password: user.password,
        user: { id: user.id, phone: user.phone, name: user.name },
        whatsappError: whatsappResult.error
      };
    }

    console.log('✅ Test number sent via WhatsApp template successfully');
    return {
      success: true,
      message: 'تم إرسال رقم الاختبار عبر قالب الواتس اب بنجاح (كلمة المرور الحالية: ' + user.password + ')',
      password: user.password,
      user: { id: user.id, phone: user.phone, name: user.name }
    };

  } catch (error) {
    console.error('❌ Error sending password via WhatsApp:', error);
    return {
      success: false,
      message: 'فشل في إرسال كلمة المرور عبر الواتس اب',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

