'use server';

import { auth } from '@/auth';
import { getWhatsAppConfig, buildApiEndpoint, getApiHeaders } from '@/lib/whatsapp/config';
import { convertToInternationalFormat } from '@/lib/whatsapp/whatsapp';

type SalesTestResult = { ok: boolean; message: string; id?: string };

export async function whatsappSalesTest(to: string, code: string): Promise<SalesTestResult> {
  const session = await auth();
  const role = session?.user?.role;
  if (!role || (role !== 'ADMIN' && role !== 'SUPER_ADMIN')) {
    return { ok: false, message: 'UNAUTHORIZED' };
  }
  try {
    const cfg = await getWhatsAppConfig();
    if (!cfg.accessToken || !cfg.phoneNumberId) return { ok: false, message: 'MISSING_CONFIG' };

    // Normalize to KSA if local 05xxxxxxxx
    let internationalPhone = convertToInternationalFormat(to);
    if (/^0?5\d{8}$/.test(to)) {
      const local = to.replace(/^0/, '');
      internationalPhone = `966${local}`;
    }

    const endpoint = await buildApiEndpoint('/messages');
    const headers = await getApiHeaders();

    async function sendWithLanguage(lang: string) {
      const body = {
        messaging_product: 'whatsapp',
        to: internationalPhone,
        type: 'template',
        template: {
          name: 'order_code', // expected template name for sales/new order code
          language: { code: lang },
          components: [
            { type: 'body', parameters: [{ type: 'text', text: code }] },
          ],
        },
      } as const;
      const res = await fetch(endpoint, { method: 'POST', headers, body: JSON.stringify(body) });
      const json = await res.json();
      return { ok: res.ok, json } as const;
    }

    const first = await sendWithLanguage('ar_SA');
    if (first.ok) return { ok: true, message: 'SENT', id: (first.json as any)?.messages?.[0]?.id };
    const msg = (first.json as any)?.error?.message as string | undefined;
    if (msg && (msg.includes('132001') || msg.toLowerCase().includes('translation'))) {
      const second = await sendWithLanguage('ar');
      return second.ok
        ? { ok: true, message: 'SENT', id: (second.json as any)?.messages?.[0]?.id }
        : { ok: false, message: (second.json as any)?.error?.message || 'FAILED' };
    }
    return { ok: false, message: msg || 'FAILED' };
  } catch (e: any) {
    return { ok: false, message: e?.message || 'REQUEST_FAILED' };
  }
}


