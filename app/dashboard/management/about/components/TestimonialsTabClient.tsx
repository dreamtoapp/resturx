"use client";
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { z } from 'zod';
import { toast } from 'sonner';
import { Star } from 'lucide-react';
import AddImage from '@/components/AddImage';
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

const testimonialSchema = z.object({
  author: z.string().min(2, 'اسم العميل مطلوب'),
  text: z.string().min(10, 'نص رأي العميل مطلوب (10 أحرف على الأقل)'),
  rating: z.number().min(1).max(5, 'التقييم يجب أن يكون بين 1 و 5'),
  imageUrl: z.string().url('رابط الصورة غير صحيح').optional().or(z.literal('')),
});

type TestimonialFormValues = z.infer<typeof testimonialSchema>;
type Testimonial = TestimonialFormValues & { id: string };

export default function TestimonialsTabClient({ aboutPageId }: { aboutPageId: string | null }) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [form, setForm] = useState<TestimonialFormValues>({
    author: '',
    text: '',
    rating: 5,
    imageUrl: ''
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);

  useEffect(() => {
    fetch('/api/about/testimonials')
      .then(res => res.json())
      .then(res => {
        if (res.success) setTestimonials(res.testimonials);
      })
      .finally(() => setListLoading(false));
  }, []);

  async function handleAddOrEdit(e: any) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const validation = testimonialSchema.safeParse(form);
    if (!validation.success) {
      setError(validation.error.errors.map(e => e.message).join(' • '));
      setLoading(false);
      return;
    }

    if (editId) {
      // Edit mode
      const res = await fetch('/api/about/testimonials', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editId, ...form }),
      });
      const result = await res.json();
      if (result.success) {
        setTestimonials((prev) => prev.map(t => t.id === editId ? result.testimonial : t));
        setForm({ author: '', text: '', rating: 5, imageUrl: '' });
        setEditId(null);
        toast.success('تم تحديث رأي العميل بنجاح');
      } else {
        setError(result.error?.toString() || 'فشل في التعديل');
      }
    } else {
      // Add mode
      if (!aboutPageId) {
        setError('لا يمكن إضافة شهادة قبل تحميل بيانات الصفحة');
        setLoading(false);
        return;
      }
      const res = await fetch('/api/about/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, aboutPageId }),
      });
      const result = await res.json();
      if (result.success) {
        setTestimonials((prev) => [...prev, result.testimonial]);
        setForm({ author: '', text: '', rating: 5, imageUrl: '' });
        toast.success('تمت إضافة رأي العميل بنجاح');
      } else {
        setError(result.error?.toString() || 'فشل في الإضافة');
      }
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    setLoading(true);
    setError(null);
    const res = await fetch('/api/about/testimonials', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    const result = await res.json();
    if (result.success) {
      setTestimonials((prev) => prev.filter(t => t.id !== id));
      if (editId === id) {
        setEditId(null);
        setForm({ author: '', text: '', rating: 5, imageUrl: '' });
      }
    } else {
      setError(result.error?.toString() || 'فشل في الحذف');
    }
    setLoading(false);
  }

  function handleEdit(testimonial: Testimonial) {
    setEditId(testimonial.id);
    setForm({
      author: testimonial.author,
      text: testimonial.text,
      rating: testimonial.rating,
      imageUrl: testimonial.imageUrl || ''
    });
  }

  function handleCancelEdit() {
    setEditId(null);
    setForm({ author: '', text: '', rating: 5, imageUrl: '' });
    setError(null);
  }

  function renderStars(rating: number) {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
      />
    ));
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Add/Edit Form Card */}
      <Card>
        <CardHeader className="text-right">
          <CardTitle>{editId ? 'تعديل الشهادة' : 'إضافة رأي عميل'}</CardTitle>
        </CardHeader>
        <CardContent className="text-right">
          <form onSubmit={handleAddOrEdit} className="space-y-4">
            <div>
              <Label htmlFor="testimonialAuthor" className="text-sm font-medium text-right block">اسم العميل</Label>
              <Input
                id="testimonialAuthor"
                value={form.author}
                onChange={e => setForm(f => ({ ...f, author: e.target.value }))}
                className="mt-1 text-right"
                placeholder="أدخل اسم العميل"
                dir="rtl"
              />
            </div>

            <div>
              <Label htmlFor="testimonialText" className="text-sm font-medium text-right block">نص رأي العميل</Label>
              <Textarea
                id="testimonialText"
                value={form.text}
                onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
                className="mt-1 min-h-[100px] text-right"
                placeholder="أدخل نص رأي العميل"
                dir="rtl"
              />
            </div>

            <div>
              <Label htmlFor="testimonialRating" className="text-sm font-medium text-right block">التقييم</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  id="testimonialRating"
                  type="number"
                  min="1"
                  max="5"
                  value={form.rating}
                  onChange={e => setForm(f => ({ ...f, rating: parseInt(e.target.value) || 5 }))}
                  className="w-20 text-center"
                />
                <div className="flex gap-1">
                  {renderStars(form.rating)}
                </div>
              </div>
            </div>

            {/* Removed optional client image URL input per request */}

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-right">
                <p className="text-destructive text-sm">{error}</p>
              </div>
            )}

            <div className="flex gap-2 pt-4 justify-end">
              <Button
                type="submit"
                disabled={loading}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {loading ? 'جاري الحفظ...' : (editId ? 'تحديث الشهادة' : 'إضافة رأي العميل')}
              </Button>
              {editId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelEdit}
                >
                  إلغاء
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Testimonials List Card */}
      <Card>
        <CardHeader className="text-right">
          <CardTitle>آراء العملاء ({testimonials.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {listLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              لا توجد آراء عملاء مضافة بعد
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {testimonials.map((testimonial) => (
                <TestimonialCard
                  key={testimonial.id}
                  testimonial={testimonial}
                  onEdit={() => handleEdit(testimonial)}
                  onDelete={() => handleDelete(testimonial.id)}
                  onUpdate={(updated) => setTestimonials(prev => prev.map(t => t.id === updated.id ? updated : t))}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function TestimonialCard({ testimonial, onEdit, onDelete, onUpdate }: { testimonial: Testimonial; onEdit: () => void; onDelete: () => void; onUpdate: (t: Testimonial) => void }) {
  return (
    <Card className="overflow-hidden">
      <div className="p-4 pt-3">
        <div className="mt-1 w-full max-w-md aspect-[4/3] border rounded-md overflow-hidden mx-auto">
          <AddImage
            url={testimonial.imageUrl}
            alt="صورة العميل"
            recordId={testimonial.id}
            table="testimonial"
            tableField="imageUrl"
            onUploadComplete={(url: string) => {
              onUpdate({ ...testimonial, imageUrl: url || '' });
            }}
            imageFit="contain"
          />
        </div>
      </div>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-medium">{testimonial.author}</h4>
              <div className="flex gap-1">{Array.from({ length: 5 }, (_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
              ))}</div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{testimonial.text}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onEdit}>تعديل</Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">حذف</Button>
              </AlertDialogTrigger>
              <AlertDialogContent dir="rtl">
                <AlertDialogHeader>
                  <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                  <AlertDialogDescription>هل أنت متأكد من حذف هذه الشهادة؟ لا يمكن التراجع عن هذا الإجراء.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>إلغاء</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete}>حذف</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
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
