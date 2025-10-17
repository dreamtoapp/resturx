'use client';

import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icons/Icon';
import type { ReactNode } from 'react';
import QRCode from 'qrcode';
import { useEffect, useState } from 'react';

interface BadgeDialogProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes?: string;
  title: string;
  description?: string;
  children?: ReactNode;
  imgClassName?: string;
  buttonAriaLabel?: string;
  qrPayload?: string;
  valueLabel?: string;
}

export default function BadgeDialog({
  src,
  alt,
  width,
  height,
  sizes,
  title,
  description,
  children,
  imgClassName,
  buttonAriaLabel,
  qrPayload,
  valueLabel,
}: BadgeDialogProps) {
  const [qrSvg, setQrSvg] = useState<string | null>(null);

  useEffect(() => {
    let canceled = false;
    (async () => {
      if (!qrPayload) return setQrSvg(null);
      const svg = await QRCode.toString(qrPayload, { type: 'svg', width: 192, margin: 1 });
      if (!canceled) setQrSvg(svg);
    })();
    return () => {
      canceled = true;
    };
  }, [qrPayload]);

  const copyToClipboard = async () => {
    if (!qrPayload) return;
    try {
      await navigator.clipboard.writeText(qrPayload);
    } catch {
      // noop
    }
  };

  const downloadSvg = () => {
    if (!qrSvg) return;
    const blob = new Blob([qrSvg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qr-code.svg';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button aria-label={buttonAriaLabel || title} className="focus:outline-none">
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            sizes={sizes}
            className={imgClassName || 'h-7 sm:h-9 w-auto opacity-80 grayscale hover:opacity-100 hover:grayscale-0 transition'}
          />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="mt-2 flex flex-col items-center gap-4">
          {/* Details first */}
          <div className="text-center space-y-3 order-1">
            {children}
            {qrPayload && (
              <div className="space-y-1">
                {valueLabel && <div className="text-xs text-muted-foreground">{valueLabel}</div>}
                <div className="flex items-center justify-center sm:justify-end gap-2">
                  <code className="text-2xl font-mono tracking-wider">{qrPayload}</code>
                  <Button variant="outline" size="icon" onClick={copyToClipboard} aria-label="نسخ">
                    <Icon name="Copy" />
                  </Button>
                </div>
                <div className="flex justify-center sm:justify-end">
                  <Button variant="secondary" size="sm" onClick={downloadSvg} className="mt-1">
                    <Icon name="Download" className="ml-1" /> تنزيل QR (SVG)
                  </Button>
                </div>
              </div>
            )}
          </div>
          {/* QR visual below */}
          {qrPayload && (
            <div className="order-2 rounded-xl border border-border bg-card p-3 shadow-sm">
              {qrSvg ? <div dangerouslySetInnerHTML={{ __html: qrSvg }} /> : null}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

