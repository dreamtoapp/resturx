'use server';

import db from '@/lib/prisma';

export async function checkPhoneExists(phone: string) {
  try {
    // Basic validation without zod for now
    if (!phone || phone.length !== 10 || !phone.startsWith('05')) {
      return {
        success: false,
        exists: false,
        message: 'رقم الهاتف غير صحيح'
      };
    }

    console.log('🔍 Checking if phone exists:', phone);

    // Check if user exists with this phone number
    const user = await db.user.findFirst({
      where: {
        phone: phone
      },
      select: {
        id: true,
        phone: true,
        name: true,
        email: true,
        // Don't select sensitive data like password
      }
    });

    if (!user) {
      console.log('❌ Phone number not found:', phone);
      return {
        success: false,
        exists: false,
        message: 'رقم الهاتف غير موجود في قاعدة البيانات'
      };
    }

    console.log('✅ Phone number found:', phone, 'User ID:', user.id);

    return {
      success: true,
      exists: true,
      message: 'تم العثور على رقم الهاتف',
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        email: user.email
      }
    };

  } catch (error) {
    console.error('❌ Error checking phone existence:', error);

    return {
      success: false,
      exists: false,
      message: 'حدث خطأ أثناء التحقق من رقم الهاتف'
    };
  }
}
