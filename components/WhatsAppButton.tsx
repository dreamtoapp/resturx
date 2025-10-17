'use client';

import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { convertToInternationalFormat } from '@/lib/whatsapp/whatsapp';
import WhatsAppIcon from '@/components/icons/WhatsAppIcon';
import { cn } from '@/lib/utils';

interface WhatsAppButtonProps extends Omit<ButtonProps, 'onClick'> {
  phone?: string;
  defaultMessage?: string;
  buttonVariant?: 'icon' | 'text' | 'footer';
  showText?: boolean;
  className?: string;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phone = '',
  defaultMessage = 'مرحباً! كيف يمكنني مساعدتك؟',
  buttonVariant = 'icon',
  showText = true,
  className,
  ...props
}) => {
  const handleClick = () => {
    if (!phone || phone.trim() === '') {
      console.warn('WhatsApp phone number not provided');
      return;
    }

    const normalized = convertToInternationalFormat(phone).replace('+', '');
    const url = `https://wa.me/${normalized}?text=${encodeURIComponent(defaultMessage)}`;
    window.open(url, '_blank');
  };

  // Icon variant (for header, mobile nav)
  if (buttonVariant === 'icon') {
    return (
      <Button
        className={cn("flex items-center justify-center border", className)}
        size="icon"
        variant="ghost"
        aria-label="تواصل عبر واتساب"
        onClick={handleClick}
        {...props}
      >
        <WhatsAppIcon size={24} className="h-6 w-6" />
      </Button>
    );
  }

  // Text variant (for buttons with text)
  if (buttonVariant === 'text') {
    return (
      <Button
        className={cn("flex items-center gap-2", className)}
        variant="default"
        onClick={handleClick}
        {...props}
      >
        <WhatsAppIcon size={16} className="h-4 w-4" />
        {showText && <span>تواصل عبر واتساب</span>}
      </Button>
    );
  }

  // Footer variant (for footer contact section)
  if (buttonVariant === 'footer') {
    if (!phone || phone.trim() === '') {
      return null; // Don't render if no phone number
    }

    const normalized = convertToInternationalFormat(phone).replace('+', '');
    const url = `https://wa.me/${normalized}?text=${encodeURIComponent(defaultMessage)}`;

    return (
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center">
          <WhatsAppIcon size={16} className="h-4 w-4 text-white" />
        </div>
        <a
          href={url}
          className="text-sm text-slate-400 hover:text-slate-100 transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          تواصل عبر واتساب
        </a>
      </div>
    );
  }

  return null;
};

export default WhatsAppButton;
