'use client';

// no React import needed in Next.js/TSX runtime
import { Trash2 } from 'lucide-react';

type Props = {
  url: string;
  isDeleting?: boolean;
  disabled?: boolean;
  onDelete: () => void | Promise<void>;
  onMoveUp: () => void;
  onMoveDown: () => void;
};

export default function HeroSlideCard({
  url,
  isDeleting = false,
  disabled = false,
  onDelete,
  onMoveUp,
  onMoveDown,
}: Props) {
  return (
    <div className="rounded-lg border bg-muted/20 overflow-hidden relative">
      <div className="aspect-[2/1] bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt="Hero slide" className="w-full h-full object-cover" />
      </div>
      <div className="p-3 flex items-center justify-between gap-2">
        <div className="flex gap-2">
          <button type="button" onClick={onMoveUp} disabled={disabled} className="px-2 py-1 rounded-md border disabled:opacity-50">↑</button>
          <button type="button" onClick={onMoveDown} disabled={disabled} className="px-2 py-1 rounded-md border disabled:opacity-50">↓</button>
        </div>
        <div className="flex gap-2 items-center">
          <button
            type="button"
            onClick={onDelete}
            disabled={isDeleting || disabled}
            title="حذف"
            aria-label="حذف"
            className="inline-flex items-center justify-center rounded-md bg-destructive text-destructive-foreground p-2 disabled:opacity-50"
          >
            {isDeleting ? (
              <span className="text-xs">…</span>
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
      {disabled && (
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />
      )}
    </div>
  );
}


