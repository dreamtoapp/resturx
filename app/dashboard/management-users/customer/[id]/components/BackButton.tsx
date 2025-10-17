'use client';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icons/Icon';

export default function BackButton() {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => window.history.back()}
      className='flex items-center gap-2'
    >
      <Icon name="ArrowLeft" size="xs" className="w-4 h-4" />
      <span>العودة</span>
    </Button>
  );
}
