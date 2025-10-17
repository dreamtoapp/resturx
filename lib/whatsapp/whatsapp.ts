// Convert KSA numbers to E.164 (+966XXXXXXXXX). Returns original if already valid.
export function convertToInternationalFormat(phoneNumber: string): string {
  const raw = phoneNumber.trim();
  const normalized = raw.replace(/[^\d+]/g, '');
  if (/^\+[1-9]\d{9,14}$/.test(normalized)) return normalized; // already E.164

  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('966') && digits.length === 12) return `+${digits}`; // 966XXXXXXXXX
  if (digits.startsWith('05') && digits.length === 10) return `+966${digits.slice(1)}`; // 05XXXXXXXX → +966XXXXXXXXX
  if (digits.length === 9 && !digits.startsWith('0')) return `+966${digits}`; // XXXXXXXXX → +966XXXXXXXXX

  console.warn(`⚠️ Unknown phone number format: ${phoneNumber}, returning as is`);
  return raw;
}

// WhatsApp API phone formatting - Official requirement: 966XXXXXXXXX (NO + symbol)
export function formatPhoneForWhatsAppAPI(phoneNumber: string): string {
  const raw = phoneNumber.trim();
  const digits = raw.replace(/\D/g, '');

  // Handle KSA numbers (05XXXXXXXX)
  if (digits.startsWith('05') && digits.length === 10) {
    return `966${digits.slice(1)}`; // 05XXXXXXXX → 966XXXXXXXX
  }

  // Handle KSA numbers without 0 (5XXXXXXXX)
  if (digits.length === 9 && digits.startsWith('5')) {
    return `966${digits}`; // 5XXXXXXXX → 966XXXXXXXX
  }

  // Handle already formatted numbers (966XXXXXXXX)
  if (digits.startsWith('966') && digits.length === 12) {
    return digits; // 966XXXXXXXX → 966XXXXXXXX
  }

  // Handle international numbers with + (+966XXXXXXXX)
  if (raw.startsWith('+966') && raw.length === 13) {
    return raw.slice(1); // +966XXXXXXXX → 966XXXXXXXX
  }

  console.warn(`⚠️ Unknown phone number format for WhatsApp API: ${phoneNumber}, returning as is`);
  return digits;
}

// Generate WhatsApp URL to prompt user to message business first
export async function generateWhatsAppGuidanceURL(_phoneNumber: string): Promise<string> {
  try {
    const db = (await import('@/lib/prisma')).default;
    const company = await db.company.findFirst({
      select: { whatsappNumber: true },
    });

    const businessPhone = company?.whatsappNumber || '+966XXXXXXXXX';
    const message = encodeURIComponent('Hello, I need to register for OTP verification');
    return `https://wa.me/${businessPhone.replace('+', '')}?text=${message}`;
  } catch (error) {
    console.warn('Failed to get WhatsApp business phone from database:', error);
    const businessPhone = '+966XXXXXXXXX';
    const message = encodeURIComponent('Hello, I need to register for OTP verification');
    return `https://wa.me/${businessPhone.replace('+', '')}?text=${message}`;
  }
}


