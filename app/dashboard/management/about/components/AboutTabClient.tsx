import AboutForm from './AboutForm';
import { AboutFormValues } from '../actions/updateAboutPageContent';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface AboutTabClientProps {
    defaultValues?: Partial<AboutFormValues>;
    onSubmit: (values: AboutFormValues) => void;
    status?: string;
    error?: string;
}

function normalizeError(err?: unknown): string | undefined {
    if (!err) return undefined;
    if (typeof err === 'string') return err;
    try {
        const anyErr: any = err as any;
        if (Array.isArray(anyErr?.formErrors) && anyErr.formErrors.length) {
            return anyErr.formErrors.join(' • ');
        }
        if (anyErr?.fieldErrors) {
            const msgs = Object.values(anyErr.fieldErrors as Record<string, string[]>)
                .flat()
                .filter(Boolean);
            if (msgs.length) return msgs.join(' • ');
        }
        return JSON.stringify(anyErr);
    } catch {
        return 'حدث خطأ غير متوقع';
    }
}

export default function AboutTabClient({ defaultValues, onSubmit, status, error }: AboutTabClientProps) {
    const errorText = normalizeError(error);
    useEffect(() => {
        if (status === 'success') {
            toast.success('تم الحفظ بنجاح');
        }
        if (errorText) {
            toast.error(errorText);
        }
    }, [status, errorText]);

    return (
        <div className="w-full text-right" dir="rtl">
            {errorText && (
                <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                    <p className="text-destructive text-sm">{errorText}</p>
                </div>
            )}
            {defaultValues && (
                <AboutForm
                    defaultValues={defaultValues}
                    onSubmit={onSubmit}
                />
            )}
            {status === 'success' && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-green-700 text-sm">تم الحفظ بنجاح</p>
                </div>
            )}
        </div>
    );
} 