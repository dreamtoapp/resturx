'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icons/Icon';
import Image from 'next/image';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantName: string;
  restaurantSlug: string;
  qrCodeUrl?: string;
}

export default function ShareModal({ isOpen, onClose, restaurantName, restaurantSlug, qrCodeUrl }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const shareUrl = `${baseUrl}/restaurant/${restaurantSlug}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleShareWhatsApp = () => {
    const text = `تفضل بزيارة ${restaurantName}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text + ' ' + shareUrl)}`;
    window.open(url, '_blank');
  };

  const handleShareFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
  };

  const handleShareTwitter = () => {
    const text = `تفضل بزيارة ${restaurantName}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="Share2" className="h-5 w-5" />
            مشاركة {restaurantName}
          </DialogTitle>
          <DialogDescription>
            شارك هذا المطعم مع أصدقائك وعائلتك
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* QR Code Display */}
          {qrCodeUrl && (
            <div className="flex flex-col items-center gap-3 p-4 bg-muted/30 rounded-lg">
              <div className="relative w-48 h-48 bg-white rounded-lg p-2">
                <Image
                  src={qrCodeUrl}
                  alt={`QR Code for ${restaurantName}`}
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-sm text-muted-foreground text-center">
                امسح رمز QR للوصول السريع
              </p>
            </div>
          )}

          {/* Copy Link */}
          <div className="flex items-center gap-2">
            <div className="flex-1 p-3 bg-muted rounded-lg text-sm truncate">
              {shareUrl}
            </div>
            <Button onClick={handleCopyLink} variant="outline" size="icon">
              <Icon name={copied ? "Check" : "Copy"} className="h-4 w-4" />
            </Button>
          </div>

          {copied && (
            <p className="text-sm text-green-600 text-center">تم نسخ الرابط! ✓</p>
          )}

          {/* Social Share Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <Button
              onClick={handleShareWhatsApp}
              variant="outline"
              className="flex flex-col items-center gap-2 h-auto py-3"
            >
              <Icon name="MessageCircle" className="h-6 w-6 text-green-600" />
              <span className="text-xs">واتساب</span>
            </Button>

            <Button
              onClick={handleShareFacebook}
              variant="outline"
              className="flex flex-col items-center gap-2 h-auto py-3"
            >
              <Icon name="Share2" className="h-6 w-6 text-blue-600" />
              <span className="text-xs">فيسبوك</span>
            </Button>

            <Button
              onClick={handleShareTwitter}
              variant="outline"
              className="flex flex-col items-center gap-2 h-auto py-3"
            >
              <Icon name="Send" className="h-6 w-6 text-sky-500" />
              <span className="text-xs">تويتر</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

