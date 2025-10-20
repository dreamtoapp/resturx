'use client';

import { useState } from 'react';
import { Icon } from '@/components/icons/Icon';
import ShareModal from './ShareModal';

interface ShareButtonProps {
  restaurantName: string;
  restaurantSlug: string;
  qrCodeUrl?: string;
}

export default function ShareButton({ restaurantName, restaurantSlug, qrCodeUrl }: ShareButtonProps) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsShareModalOpen(true)}
        className="flex items-center justify-center w-10 h-10 border rounded-lg hover:bg-muted transition-all hover:border-primary/50 group"
        title="مشاركة"
      >
        <Icon name="Share2" className="h-5 w-5 group-hover:text-primary transition-colors" />
      </button>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        restaurantName={restaurantName}
        restaurantSlug={restaurantSlug}
        qrCodeUrl={qrCodeUrl}
      />
    </>
  );
}

