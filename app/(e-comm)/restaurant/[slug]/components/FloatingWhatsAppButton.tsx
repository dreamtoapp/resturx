'use client';

import WhatsAppButton from '@/components/WhatsAppButton';
import WhatsAppIcon from '@/components/icons/WhatsAppIcon';

interface FloatingWhatsAppButtonProps {
  whatsapp: string;
  restaurantName: string;
}

export default function FloatingWhatsAppButton({ whatsapp, restaurantName }: FloatingWhatsAppButtonProps) {
  return (
    <div className="fixed bottom-6 left-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-500">
      <WhatsAppButton
        phone={whatsapp}
        defaultMessage={`مرحباً! أود الاستفسار عن ${restaurantName}`}
        buttonVariant="default"
        className="h-14 w-14 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center group"
      >
        <WhatsAppIcon size={28} className="group-hover:scale-110 transition-transform" />
        <span className="sr-only">تواصل عبر واتساب</span>
      </WhatsAppButton>
    </div>
  );
}

