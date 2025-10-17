'use server';

import { auth } from '@/auth';
import { sendOTPTemplate } from '@/lib/whatsapp/send-otp-template';

type WhatsAppTestResult = {
  ok: boolean;
  message: string;
  missing?: string[];
  id?: string;
};

export async function whatsappCloudTest(to: string, otp?: string): Promise<WhatsAppTestResult> {
  const session = await auth();
  const role = session?.user?.role;
  if (!role || (role !== 'ADMIN' && role !== 'SUPER_ADMIN')) {
    return { ok: false, message: 'UNAUTHORIZED' };
  }

  try {
    const result = await sendOTPTemplate(to, otp || '123456');
    if (result.success) {
      const id = (result.data as any)?.messages?.[0]?.id as string | undefined;
      return { ok: true, message: 'SENT', id };
    }
    return { ok: false, message: result.error || 'FAILED' };
  } catch (e: any) {
    const msg: string = e?.message || 'REQUEST_FAILED';
    return { ok: false, message: msg };
  }
}


