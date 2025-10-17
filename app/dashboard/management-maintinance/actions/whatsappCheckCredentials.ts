'use server';

import { auth } from '@/auth';
import { getWhatsAppConfig } from '@/lib/whatsapp/config';

type CheckResult = {
  ok: boolean;
  message: string;
  displayPhone?: string | null;
  status?: number;
  missing?: string[];
  tokenPresent: boolean;
  phoneIdPresent: boolean;
};

// Validates WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID by calling Graph API
export async function whatsappCheckCredentials(): Promise<CheckResult> {
  const session = await auth();
  const role = session?.user?.role;
  if (!role || (role !== 'ADMIN' && role !== 'SUPER_ADMIN')) {
    return { ok: false, message: 'UNAUTHORIZED', tokenPresent: false, phoneIdPresent: false };
  }
  try {
    const cfg = await getWhatsAppConfig();
    const missing: string[] = [];
    if (!cfg.accessToken) missing.push('accessToken');
    if (!cfg.phoneNumberId) missing.push('phoneNumberId');
    if (missing.length) return { ok: false, message: 'MISSING_CONFIG', missing, tokenPresent: !!cfg.accessToken, phoneIdPresent: !!cfg.phoneNumberId };

    const url = `https://graph.facebook.com/${cfg.apiVersion}/${cfg.phoneNumberId}?fields=display_phone_number,verified_name`;
    const res = await fetch(url, {
      method: 'GET',
      headers: { Authorization: `Bearer ${cfg.accessToken}` },
      cache: 'no-store',
    });

    if (!res.ok) {
      return { ok: false, status: res.status, message: `HTTP_${res.status}`, tokenPresent: !!cfg.accessToken, phoneIdPresent: !!cfg.phoneNumberId };
    }
    const data = (await res.json()) as any;
    return {
      ok: true,
      message: 'VALID',
      displayPhone: data?.display_phone_number ?? null,
      tokenPresent: !!cfg.accessToken,
      phoneIdPresent: !!cfg.phoneNumberId,
    };
  } catch (e: any) {
    return { ok: false, message: e?.message || 'REQUEST_FAILED', tokenPresent: false, phoneIdPresent: false };
  }
}


