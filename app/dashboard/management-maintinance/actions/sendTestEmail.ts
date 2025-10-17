'use server';

import { auth } from '@/auth';
import { sendOtpEmail } from '@/lib/email/sendOtpEmail';

export async function sendTestEmail(to: string) {
  const session = await auth();
  const role = session?.user?.role;
  if (!role || (role !== 'ADMIN' && role !== 'SUPER_ADMIN')) {
    return { ok: false, message: 'UNAUTHORIZED' } as const;
  }
  if (!to) return { ok: false, message: 'MISSING_TO' } as const;

  try {
    const res = await sendOtpEmail(to, '123456', 'Admin');
    return { ok: res.success, message: res.message } as const;
  } catch {
    return { ok: false, message: 'FAILED' } as const;
  }
}


