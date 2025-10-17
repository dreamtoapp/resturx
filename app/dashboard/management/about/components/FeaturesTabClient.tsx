"use client";
import { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { z } from 'zod';
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogCancel,
    AlertDialogAction,
} from '@/components/ui/alert-dialog';
import AddImage from '@/components/AddImage';
import { toast } from 'sonner';

const featureSchema = z.object({
    title: z.string().min(2, 'العنوان مطلوب'),
    description: z.string().min(2, 'الوصف مطلوب'),
    imageUrl: z.string().url('رابط الصورة غير صالح').optional(),
});

type FeatureFormValues = z.infer<typeof featureSchema>;

type Feature = FeatureFormValues & { id: string };

function extractErrorMessage(error: any): string {
    if (!error) return "حدث خطأ غير متوقع";
    if (typeof error === "string") return error;
    if (error.message) return error.message;
    if (error.error && error.error.fieldErrors) {
        const firstField = Object.values(error.error.fieldErrors)[0];
        if (Array.isArray(firstField) && firstField.length > 0) {
            return firstField[0];
        }
    }
    if (error.code && error.meta && error.meta.cause) return error.meta.cause;
    try {
        return JSON.stringify(error);
    } catch {
        return "حدث خطأ غير متوقع";
    }
}

export default function FeaturesTabClient({ aboutPageId }: { aboutPageId: string | null }) {
    const [features, setFeatures] = useState<Feature[]>([]);
    const [form, setForm] = useState<FeatureFormValues>({ title: '', description: '' });
    const [editId, setEditId] = useState<string | null>(null);
    const [error, setError] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [listLoading, setListLoading] = useState(true);
    const titleInputRef = useRef<HTMLInputElement>(null!);

    useEffect(() => {
        fetch('/api/about/features')
            .then(res => res.json())
            .then(res => {
                if (res.success) setFeatures(res.features);
            })
            .finally(() => setListLoading(false));
    }, []);

    useEffect(() => {
        if (editId && titleInputRef.current) {
            titleInputRef.current.focus();
        }
    }, [editId]);

    async function handleAddOrEdit(e: any) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        if (editId) {
            // Edit mode (require imageUrl)
            if (!form.imageUrl) {
                setError({ fieldErrors: { imageUrl: ['رابط الصورة غير صالح'] } });
                setLoading(false);
                return;
            }
            const res = await fetch('/api/about/features', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: editId, ...form, aboutPageId }),
            });
            const result = await res.json();
            if (result.success) {
                setFeatures((prev) => prev.map(f => f.id === editId ? result.feature : f));
                setForm({ title: '', description: '' });
                setEditId(null);
                toast.success('تم تحديث الميزة بنجاح');
            } else {
                setError(result.error);
            }
        } else {
            // Add mode (do not require imageUrl)
            const res = await fetch('/api/about/features', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, aboutPageId }),
            });
            const result = await res.json();
            if (result.success) {
                setFeatures((prev) => [...prev, result.feature]);
                setForm({ title: '', description: '' });
                toast.success('تمت إضافة الميزة بنجاح');
            } else {
                setError(result.error);
            }
        }
        setLoading(false);
    }

    async function handleDelete(id: string) {
        setLoading(true);
        setError(null);
        const res = await fetch('/api/about/features', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        });
        const result = await res.json();
        if (result.success) {
            setFeatures((prev) => prev.filter(f => f.id !== id));
            if (editId === id) {
                setEditId(null);
                setForm({ title: '', description: '' });
            }
        } else {
            setError(extractErrorMessage(result.error));
        }
        setLoading(false);
    }



    function handleCancelEdit() {
        setEditId(null);
        setForm({ title: '', description: '' });
        setError(null);
    }

    return (
        <div className="space-y-6" dir="rtl">
            <FeatureForm
                editId={editId}
                loading={loading}
                error={error}
                form={form}
                onChange={setForm}
                onSubmit={handleAddOrEdit}
                onCancel={handleCancelEdit}
                titleInputRef={titleInputRef}
            />

            <Card>
                <CardHeader className="text-right">
                    <CardTitle>المميزات الحالية ({features.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {listLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <SkeletonCard key={i} />
                            ))}
                        </div>
                    ) : features.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">لا توجد مميزات مضافة بعد</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {features.map((feature) => (
                                <FeatureCard
                                    key={feature.id}
                                    feature={feature}
                                    aboutPageId={aboutPageId}
                                    onUpdate={(updated) => setFeatures(prev => prev.map(f => f.id === updated.id ? updated : f))}
                                    onDelete={() => handleDelete(feature.id)}
                                />
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

function FeatureForm({
    editId,
    loading,
    error,
    form,
    onChange,
    onSubmit,
    onCancel,
    titleInputRef,
}: {
    editId: string | null;
    loading: boolean;
    error: any;
    form: FeatureFormValues;
    onChange: React.Dispatch<React.SetStateAction<FeatureFormValues>>;
    onSubmit: (e: any) => void;
    onCancel: () => void;
    titleInputRef: React.RefObject<HTMLInputElement>;
}) {
    return (
        <Card>
            <CardHeader className="text-right">
                <CardTitle>{editId ? 'تعديل الميزة' : 'إضافة ميزة جديدة'}</CardTitle>
            </CardHeader>
            <CardContent className="text-right">
                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="featureTitle" className="text-sm font-medium text-right block">العنوان</Label>
                        <Input
                            id="featureTitle"
                            ref={titleInputRef}
                            value={form.title}
                            onChange={e => onChange(f => ({ ...f, title: e.target.value }))}
                            className="mt-1 text-right"
                            placeholder="أدخل عنوان الميزة"
                            dir="rtl"
                        />
                        {error && typeof error === 'object' && error.fieldErrors?.title && (
                            <p className="text-destructive text-sm mt-1 text-right">{error.fieldErrors.title[0]}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="featureDescription" className="text-sm font-medium text-right block">الوصف</Label>
                        <Textarea
                            id="featureDescription"
                            value={form.description}
                            onChange={e => onChange(f => ({ ...f, description: e.target.value }))}
                            className="mt-1 min-h-[100px] text-right"
                            placeholder="أدخل وصف الميزة"
                            dir="rtl"
                        />
                        {error && typeof error === 'object' && error.fieldErrors?.description && (
                            <p className="text-destructive text-sm mt-1 text-right">{error.fieldErrors.description[0]}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="featureImage" className="text-sm font-medium text-right block">صورة الميزة</Label>
                        {editId ? (
                            <div className="mt-1 w-full max-w-md aspect-[4/3] border rounded-md overflow-hidden">
                                <AddImage
                                    url={form.imageUrl}
                                    alt="صورة الميزة"
                                    recordId={editId}
                                    table="feature"
                                    tableField="imageUrl"
                                    onUploadComplete={(url: string) => onChange(f => ({ ...f, imageUrl: url }))}
                                    imageFit="contain"
                                />
                            </div>
                        ) : null}
                        {error && typeof error === 'object' && error.fieldErrors?.imageUrl && (
                            <p className="text-destructive text-sm mt-1 text-right">{error.fieldErrors.imageUrl[0]}</p>
                        )}
                    </div>

                    {error && typeof error === 'object' && error.fieldErrors?.aboutPageId && (
                        <p className="text-destructive text-sm text-right">{error.fieldErrors.aboutPageId[0]}</p>
                    )}
                    {error && typeof error === 'object' && Array.isArray(error.formErrors) && error.formErrors.length > 0 && (
                        <ul className="text-destructive text-sm text-right">
                            {error.formErrors.map((msg: string, i: number) => <li key={i}>{msg}</li>)}
                        </ul>
                    )}
                    {error && typeof error === 'string' && (
                        <p className="text-destructive text-sm text-right">{error}</p>
                    )}

                    <div className="flex gap-2 pt-4 justify-end">
                        <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                            {loading ? 'جاري الحفظ...' : (editId ? 'تحديث الميزة' : 'إضافة الميزة')}
                        </Button>
                        {editId && (
                            <Button type="button" variant="outline" onClick={onCancel}>إلغاء</Button>
                        )}
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

function FeatureCard({ feature, aboutPageId, onUpdate, onDelete }: { feature: Feature; aboutPageId: string | null; onUpdate: (f: Feature) => void; onDelete: () => void }) {
    const [isEditing, setIsEditing] = useState(false);
    const [local, setLocal] = useState<FeatureFormValues>({ title: feature.title, description: feature.description, imageUrl: feature.imageUrl });
    const [saving, setSaving] = useState(false);

    async function handleSave() {
        try {
            setSaving(true);
            const res = await fetch('/api/about/features', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: feature.id, ...local, aboutPageId }),
            });
            const result = await res.json();
            if (result.success) {
                onUpdate(result.feature as Feature);
                setIsEditing(false);
            }
        } finally {
            setSaving(false);
        }
    }

    return (
        <Card className="overflow-hidden">
            {/* Image updater (single source of truth) */}
            <div className="p-4 pt-3">
                <div className="mt-1 w-full max-w-md aspect-[4/3] border rounded-md overflow-hidden mx-auto">
                    <AddImage
                        url={local.imageUrl}
                        alt="صورة الميزة"
                        recordId={feature.id}
                        table="feature"
                        tableField="imageUrl"
                        onUploadComplete={(url: string) => {
                            setLocal(v => ({ ...v, imageUrl: url }));
                            onUpdate({ id: feature.id, title: feature.title, description: feature.description, imageUrl: url });
                        }}
                        imageFit="contain"
                    />
                </div>
            </div>
            <CardContent className="p-4 space-y-3">
                {isEditing ? (
                    <>
                        <Input value={local.title} onChange={e => setLocal(v => ({ ...v, title: e.target.value }))} className="text-right" dir="rtl" />
                        <Textarea value={local.description} onChange={e => setLocal(v => ({ ...v, description: e.target.value }))} className="min-h-[80px] text-right" dir="rtl" />
                        {/* Image editing handled separately above; keep text-only editing here */}
                        <div className="flex gap-2 justify-end">
                            <Button size="sm" onClick={handleSave} disabled={saving} className="bg-primary text-primary-foreground">{saving ? 'جاري الحفظ...' : 'حفظ'}</Button>
                            <Button size="sm" variant="outline" onClick={() => { setLocal({ title: feature.title, description: feature.description, imageUrl: feature.imageUrl }); setIsEditing(false); }}>إلغاء</Button>
                        </div>
                    </>
                ) : (
                    <>
                        <h3 className="font-semibold text-foreground mb-1 text-right">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3 text-right">{feature.description}</p>
                        <div className="flex gap-2 justify-end">
                            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>تعديل</Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="sm">حذف</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent dir="rtl">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                                        <AlertDialogDescription>هل أنت متأكد من حذف هذه الميزة؟ لا يمكن التراجع عن هذا الإجراء.</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                        <AlertDialogAction onClick={onDelete}>حذف</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}

function SkeletonCard() {
    return (
        <Card className="overflow-hidden">
            <div className="w-full h-40 bg-muted animate-pulse" />
            <CardContent className="p-4 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
                <div className="h-3 bg-muted rounded w-full animate-pulse" />
                <div className="h-3 bg-muted rounded w-5/6 animate-pulse" />
            </CardContent>
        </Card>
    );
}