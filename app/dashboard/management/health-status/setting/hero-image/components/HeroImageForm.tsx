"use client";

import { useRef, useState, useTransition } from 'react';
import HeroSlideCard from '@/components/HeroSlideCard';

type HeroSlide = { url: string; publicId?: string };

export default function HeroImageForm({ initialUrl: _initialUrl, companyId, initialSlides = [] as HeroSlide[] }: { initialUrl?: string; companyId?: string; initialSlides?: HeroSlide[] }) {
  const [slides, setSlides] = useState<HeroSlide[]>(initialSlides);
  const addInputRef = useRef<HTMLInputElement | null>(null);
  const [addUploading, setAddUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);
  const MAX_SLIDES = 10;
  const remaining = Math.max(0, MAX_SLIDES - slides.length);

  const uploadFile = async (file: File): Promise<{ url: string; publicId?: string }> => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('table', 'company');
      formData.append('uploadOnly', 'true');

      const xhr = new XMLHttpRequest();
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setProgress(percent);
        }
      };
      xhr.onload = () => {
        try {
          const data = JSON.parse(xhr.responseText);
          if (xhr.status >= 200 && xhr.status < 300 && data.imageUrl) {
            resolve({ url: data.imageUrl as string, publicId: data.publicId as (string | undefined) });
          } else {
            reject(new Error((data && (data.error?.message || data.error)) || 'Upload failed'));
          }
        } catch (e) {
          reject(new Error('Upload failed'));
        }
      };
      xhr.onerror = () => reject(new Error('Network error'));
      xhr.open('POST', `/api/images`);
      xhr.send(formData);
    });
  };

  const onPickAdd = () => addInputRef.current?.click();
  const onAddFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAddUploading(true);
    setProgress(0);
    try {
      const { url, publicId } = await uploadFile(file);
      setSlides(prev => [...prev, { url, publicId }]);
    } finally {
      setAddUploading(false);
      setProgress(0);
      if (addInputRef.current) addInputRef.current.value = '';
    }
  };

  const removeSlide = async (index: number) => {
    const target = slides[index];
    if (!target) return;
    setDeletingIndex(index);
    try {
      const payload = {
        table: 'company',
        recordId: companyId || '',
        field: 'heroSlides' as const,
        publicId: target.publicId,
        url: target.url,
        index,
      };
      await fetch('/api/images/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).then(async (r) => { if (!r.ok) throw new Error('Delete failed'); });
    } catch {
      // fallback to local remove; DB will sync on Save
    } finally {
      setSlides(prev => prev.filter((_, i) => i !== index));
      setDeletingIndex(null);
    }
  };

  // Replace functionality removed per UX direction

  const moveUp = (index: number) => {
    if (index <= 0) return;
    setSlides(prev => {
      const copy = [...prev];
      const tmp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = tmp;
      return copy;
    });
  };

  const moveDown = (index: number) => {
    if (index >= slides.length - 1) return;
    setSlides(prev => {
      const copy = [...prev];
      const tmp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = tmp;
      return copy;
    });
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* إدارة صور الهيرو (متعددة) */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">عارض صور الهيرو (متعدد)</h3>
          <p className="text-sm text-muted-foreground">أضف أو احذف أو أعد ترتيب الصور. الحد الأقصى {MAX_SLIDES} صور. المتبقي: {remaining}.</p>
        </div>


        {/* useHeroSlider toggle is managed in platform settings; no toggle here */}

        {/* Add new slide via file picker with inline progress */}
        <div className="flex gap-2 items-center">
          <input ref={addInputRef} type="file" accept="image/*" className="hidden" onChange={onAddFile} />
          <button type="button" onClick={onPickAdd} className="px-3 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50" disabled={isPending || addUploading || slides.length >= MAX_SLIDES}>
            {addUploading ? 'جارٍ الرفع...' : 'إضافة صورة'}
          </button>
          {slides.length >= MAX_SLIDES && (
            <span className="text-xs text-muted-foreground">تم بلوغ الحد الأقصى ({MAX_SLIDES}). احذف صورة لإضافة أخرى.</span>
          )}
        </div>

        {/* Slides list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {addUploading && (
            <div className="rounded-lg border bg-muted/20 overflow-hidden relative">
              <div className="aspect-[2/1] bg-muted animate-pulse" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/30">
                <div className="w-32 h-2 rounded bg-background/40 overflow-hidden">
                  <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
                </div>
                <span className="text-xs text-white/90">جاري الرفع {progress}%</span>
              </div>
            </div>
          )}
          {slides.map((s, index) => (
            <HeroSlideCard
              key={`${s.url}-${index}`}
              url={s.url}
              isDeleting={deletingIndex === index}
              disabled={isPending || addUploading}
              onDelete={() => removeSlide(index)}
              onMoveUp={() => moveUp(index)}
              onMoveDown={() => moveDown(index)}
            />
          ))}
        </div>

        {/* Tips (moved to bottom under the grid) */}
        <div className="bg-muted/30 rounded-lg p-4 border border-border">
          <div className="flex items-start gap-3">
            <div className="p-1 bg-muted rounded-full">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h5 className="text-sm font-medium text-foreground mb-1">نصائح لصورة الهيرو المثالية</h5>
              <p className="text-xs text-muted-foreground">استخدم صورًا واضحة وجذابة (PNG, JPG, WEBP, AVIF). الأبعاد الموصى بها 1920×600 بكسل والحد الأقصى 5MB. تجنب النصوص الكثيفة داخل الصور.</p>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <form action={async (formData: FormData) => {
            formData.set('companyId', companyId || '');
            formData.set('slidesJson', JSON.stringify(slides));
            const { saveHeroSlides } = await import('../actions/saveHeroSlides');
            startTransition(() => { void saveHeroSlides(formData); });
          }}>
            <button type="submit" disabled={isPending} className="px-4 py-2 rounded-md bg-primary text-primary-foreground">
              {isPending ? 'جارٍ الحفظ...' : 'حفظ'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}


