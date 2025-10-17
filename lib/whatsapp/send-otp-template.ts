'use server';

import { getWhatsAppConfig, buildApiEndpoint, getApiHeaders } from '@/lib/whatsapp/config';
import { formatPhoneForWhatsAppAPI } from '@/lib/whatsapp/whatsapp';

export interface TemplateMessageResponse {
  success: boolean;
  data?: unknown;
  error?: string;
}

// Send OTP using WhatsApp approved template
export async function sendOTPTemplate(
  phoneNumber: string,
  otp: string
): Promise<TemplateMessageResponse> {
  try {
    const { accessToken, phoneNumberId } = await getWhatsAppConfig();
    if (!accessToken || !phoneNumberId) return { success: false, error: 'Server configuration error' };

    // Use proper WhatsApp API phone formatting (966XXXXXXXXX format)
    const internationalPhone = formatPhoneForWhatsAppAPI(phoneNumber);
    console.log(`📱 Phone formatting: ${phoneNumber} → ${internationalPhone}`);

    const endpoint = await buildApiEndpoint('/messages');
    const headers = await getApiHeaders();

    // Use 'ar' directly since template only exists in generic Arabic
    const body = {
      messaging_product: 'whatsapp',
      to: internationalPhone,
      type: 'template',
      template: {
        name: 'confirm',
        language: { code: 'ar' }, // ✅ Use 'ar' directly - template exists here
        components: [
          {
            type: 'body',
            parameters: [{
              type: 'number',     // ✅ FIXED: Template expects NUMBER, not text
              text: otp           // ✅ This will be converted to number by WhatsApp
            }],
          },
        ],
      },
    } as const;

    console.log(`📤 Sending WhatsApp template to ${internationalPhone} with language ar`);
    console.log(`📤 Request body:`, JSON.stringify(body, null, 2));

    const res = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const json = await res.json();
    console.log(`📡 WhatsApp API response (${res.status}):`, JSON.stringify(json, null, 2));

    if (res.ok) {
      return { success: true, data: json };
    } else {
      return { success: false, error: json?.error?.message || 'Failed to send template' };
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('❌ Error in sendOTPTemplate:', error);
    return { success: false, error: errorMessage };
  }
}





