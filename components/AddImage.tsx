'use client';

import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import Image from 'next/image';
import { Icon } from '@/components/icons/Icon';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface AddImageProps {
  url?: string;
  alt?: string;
  className?: string;
  recordId: string;
  table: string;
  tableField: string;
  cloudinaryPreset?: string; // Made optional - will use env var if not provided
  onUploadComplete?: (url: string) => void;
  autoUpload?: boolean;
  folder?: string; // Optional folder for Cloudinary - if not provided, uses CLOUDINARY_UPLOAD_PRESET/CLOUDINARY_CLIENT_FOLDER/table
  // New UX controls
  showBottomProgress?: boolean; // default: false (overlay only)
  useShadcnAlert?: boolean; // default: true (use Alert by default)
  // Client-side validation (safe defaults)
  acceptMimeTypes?: string[]; // default common images
  maxFileSizeMB?: number; // default 5MB
  requiredMinDimensions?: { width: number; height: number }; // default undefined (off)
  imageFit?: 'cover' | 'contain';
}

const AddImage: React.FC<AddImageProps> = ({
  url,
  alt = 'صورة',
  className = '',
  recordId,
  table,
  cloudinaryPreset, // Optional - API will use env var if not provided
  onUploadComplete,
  tableField = 'image', // Default to 'image' if not provided
  autoUpload = false,
  folder, // Optional - API will auto-generate using env vars if not provided
  showBottomProgress = false,
  useShadcnAlert = true,
  acceptMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
  maxFileSizeMB = 5,
  requiredMinDimensions,
  imageFit = 'cover',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | undefined>(url);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errorCode, setErrorCode] = useState<string | undefined>(undefined);
  const [progress, setProgress] = useState(0);
  const xhrRef = useRef<XMLHttpRequest | null>(null);

  useEffect(() => {
    setPreview(url);
  }, [url]);

  const handleImageClick = () => {
    if (loading) return; // prevent opening picker during upload
    inputRef.current?.click();
  };

  const validateSelectedFile = async (candidate: File): Promise<{ ok: true } | { ok: false; message: string; code?: string }> => {
    // Size check
    if (typeof maxFileSizeMB === 'number' && Number.isFinite(maxFileSizeMB)) {
      const maxBytes = maxFileSizeMB * 1024 * 1024;
      if (candidate.size > maxBytes) {
        return { ok: false, message: `حجم الصورة كبير جدًا. الحد الأقصى ${maxFileSizeMB}MB`, code: 'FileTooLarge' };
      }
    }
    // Type check
    if (Array.isArray(acceptMimeTypes) && acceptMimeTypes.length > 0) {
      if (!acceptMimeTypes.includes(candidate.type)) {
        return { ok: false, message: 'صيغة الصورة غير مدعومة. يُسمح بـ JPEG, PNG, WEBP, AVIF', code: 'UnsupportedFormat' };
      }
    }
    // Dimensions check (optional)
    if (requiredMinDimensions) {
      const { width: minW, height: minH } = requiredMinDimensions;
      const objectUrl = URL.createObjectURL(candidate);
      try {
        const dims = await new Promise<{ w: number; h: number }>((resolve, reject) => {
          const img = new window.Image();
          img.onload = () => resolve({ w: img.width, h: img.height });
          img.onerror = reject;
          img.src = objectUrl;
        });
        URL.revokeObjectURL(objectUrl);
        if (dims.w < minW || dims.h < minH) {
          return { ok: false, message: `أبعاد الصورة صغيرة. الحد الأدنى ${minW}x${minH}px`, code: 'DimensionsTooSmall' };
        }
      } catch {
        URL.revokeObjectURL(objectUrl);
        // If we can't read dimensions, fail softly (do not block)
      }
    }
    return { ok: true };
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    // Reset previous errors
    setError('');
    setErrorCode(undefined);

    // Client-side validation (enabled by defaults)
    const validation = await validateSelectedFile(selected);
    if ('ok' in validation && !validation.ok) {
      const message = validation.message;
      // Avoid duplicating same error message repeatedly
      setError(prev => (prev === message ? prev : message));
      setErrorCode(validation.code);
      return;
    }

    setFile(selected);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selected);

    if (autoUpload) {
      handleUpload(selected);
    }
  };

  const handleUpload = (overrideFile?: File) => {
    const imageFile = overrideFile || file;
    if (!imageFile) return;

    setLoading(true);
    setError('');
    setProgress(0);

    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('recordId', recordId);
    formData.append('table', table);
    formData.append('tableField', tableField);
    // Only append cloudinaryPreset if provided, otherwise API will use env var
    if (cloudinaryPreset) {
      formData.append('cloudinaryPreset', cloudinaryPreset);
    }
    // Only append folder if provided, otherwise API will auto-generate using env vars
    if (folder) {
      formData.append('folder', folder);
    }



    const xhr = new XMLHttpRequest();
    xhrRef.current = xhr;

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setProgress(percent);
      }
    };
    xhr.onload = () => {
      setLoading(false);
      xhrRef.current = null;
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300 && data.imageUrl) {
          setPreview(data.imageUrl);
          setFile(null);
          setProgress(100);
          onUploadComplete?.(data.imageUrl);
        } else {
          // Map backend/Cloudinary errors to human-friendly messages
          const mapped = (() => {
            const raw = (data && (data.error?.message || data.error)) || 'Upload failed';
            const lower = String(raw).toLowerCase();
            if (lower.includes('file size') || lower.includes('too large') || lower.includes('413')) {
              return { message: `حجم الصورة كبير جدًا. الحد الأقصى ${maxFileSizeMB}MB`, code: 'FileTooLarge' };
            }
            if (lower.includes('unsupported') || lower.includes('format') || lower.includes('extension')) {
              return { message: 'صيغة الصورة غير مدعومة. يُسمح بـ JPEG, PNG, WEBP, AVIF', code: 'UnsupportedFormat' };
            }
            if (lower.includes('signature') || lower.includes('auth')) {
              return { message: 'حدثت مشكلة في التحقق من الرفع. حاول مجددًا.', code: 'InvalidSignature' };
            }
            if (lower.includes('rate') || lower.includes('limit')) {
              return { message: 'محاولات كثيرة. يرجى المحاولة لاحقًا.', code: 'RateLimited' };
            }
            return { message: typeof raw === 'string' ? raw : 'حدث خطأ أثناء الرفع', code: 'UploadFailed' };
          })();
          throw Object.assign(new Error(mapped.message), { code: mapped.code });
        }
      } catch (err: any) {
        const msg = err?.message || 'Upload error';
        setError(prev => (prev === msg ? prev : msg));
        setErrorCode(err?.code);
      }
    };

    xhr.onerror = () => {
      setLoading(false);
      xhrRef.current = null;
      const msg = 'تعذر الرفع بسبب مشكلة في الاتصال بالشبكة.';
      setError(prev => (prev === msg ? prev : msg));
      setErrorCode('NetworkError');
    };

    xhr.onabort = () => {
      setLoading(false);
      xhrRef.current = null;
      setError('تم إلغاء الرفع');
      setProgress(0);
      setErrorCode('UploadAborted');
    };

    xhr.open('POST', `/api/images`);
    xhr.send(formData);
  };

  const cancelUpload = () => {
    try {
      xhrRef.current?.abort();
    } catch (_) {
      // noop
    }
  };

  return (
    <div
      onClick={handleImageClick}
      className={`relative w-full h-full cursor-pointer group ${className}`}
    >
      {preview ? (
        <Image
          src={preview}
          alt={alt}
          fill
          sizes="100%"
          className={`${imageFit === 'contain' ? 'object-contain' : 'object-cover'} rounded-md bg-muted`}
          priority
          onError={() => setPreview(undefined)}
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full bg-muted-foreground/10 rounded-md">
          <Icon name="Plus" className="h-10 w-10 text-muted-foreground" />
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Upload button with progress */}
      {file && !autoUpload && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation(); // prevent file picker reopening
            handleUpload();
          }}
          disabled={loading}
          className="absolute bottom-2 right-2 bg-primary text-primary-foreground text-xs px-3 py-1 rounded shadow hover:bg-primary/80"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Icon name="Loader2" className="animate-spin h-4 w-4" />
              {progress > 0 ? `${progress}%` : 'جاري الحفظ...'}
            </span>
          ) : (
            'حفظ الصورة'
          )}
        </button>
      )}

      {/* Upload overlay and progress */}
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-none">
          <div className="pointer-events-auto flex flex-col items-center gap-3 rounded-md bg-background/90 px-3 py-2 shadow border border-border">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Icon name="Loader2" className="h-4 w-4 animate-spin" />
              <span aria-live="polite">جارٍ الرفع</span>
            </div>
            <div
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
              className="w-32 h-2 rounded bg-muted overflow-hidden"
            >
              <div
                className="h-full bg-primary transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-xs text-muted-foreground">{progress}%</div>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); cancelUpload(); }}
              className="mt-1 text-[11px] px-2 py-1 rounded border border-border hover:bg-muted/50"
            >
              إلغاء
            </button>
          </div>
        </div>
      )}

      {/* Progress bar (bottom - optional) */}
      {loading && showBottomProgress && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200 rounded overflow-hidden">
          <div
            className="bg-primary h-full transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Error message with retry (Alert by default, fallback to inline) */}
      {error && (
        useShadcnAlert ? (
          <div className="absolute top-2 left-2 right-2 z-20">
            <Alert variant="destructive" className="bg-destructive/95 backdrop-blur-sm border-destructive shadow-lg">
              <AlertTitle className="text-destructive-foreground font-semibold">فشل رفع الصورة{errorCode ? ` (${errorCode})` : ''}</AlertTitle>
              <AlertDescription className="text-destructive-foreground">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate">{error}</span>
                  <div className="flex items-center gap-2">
                    {file && !loading && (
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setError(''); setErrorCode(undefined); handleUpload(file); }}
                        className="px-3 py-1 rounded bg-background text-foreground border border-border hover:bg-background/90 font-medium"
                      >
                        إعادة المحاولة
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setError(''); setErrorCode(undefined); }}
                      aria-label="إغلاق"
                      className="px-2 py-1 rounded border border-border hover:bg-background/20 text-destructive-foreground"
                    >
                      ×
                    </button>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <div role="alert" aria-live="polite" className="absolute top-2 left-2 right-2 bg-destructive/95 backdrop-blur-sm text-destructive-foreground text-sm p-3 rounded shadow-lg border border-destructive flex items-center justify-between gap-2 z-20">
            <span className="truncate font-medium">{error}</span>
            <div className="flex items-center gap-2">
              {file && !loading && (
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setError(''); setErrorCode(undefined); handleUpload(file); }}
                  className="px-3 py-1 rounded bg-background text-foreground border border-border hover:bg-background/90 font-medium"
                >
                  إعادة المحاولة
                </button>
              )}
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setError(''); setErrorCode(undefined); }}
                aria-label="إغلاق"
                className="px-2 py-1 rounded border border-border hover:bg-background/20 text-destructive-foreground"
              >
                ×
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default AddImage;
