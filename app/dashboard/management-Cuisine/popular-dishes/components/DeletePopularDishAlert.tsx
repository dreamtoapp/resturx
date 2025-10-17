'use client';
import { useState } from 'react';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icons/Icon';
import { deletePopularDish } from '../actions/delete-popular-dish';

interface DeletePopularDishAlertProps {
  dishId: string;
  cuisineId: string;
}

export default function DeletePopularDishAlert({
  dishId,
  cuisineId,
}: DeletePopularDishAlertProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDelete = async () => {
    setIsProcessing(true);
    try {
      const result = await deletePopularDish(dishId, cuisineId);
      const Swal = (await import('sweetalert2')).default;
      if (result.success) {
        Swal.fire({
          icon: 'success',
          title: 'تم الحذف بنجاح',
          text: 'تم إزالة الطبق المشهور بشكل نهائي من النظام',
          confirmButtonText: 'تم',
          confirmButtonAriaLabel: 'تأكيد استلام رسالة النجاح',
        });
        return;
      }
      Swal.fire({
        icon: 'error',
        title: 'تعذر الحذف',
        text: result.message || 'حدث خطأ أثناء محاولة الحذف. يرجى المحاولة لاحقًا',
        confirmButtonText: 'حسناً',
        confirmButtonAriaLabel: 'تأكيد استلام رسالة الخطأ',
      });
    } catch {
      const Swal = (await import('sweetalert2')).default;
      Swal.fire({
        icon: 'error',
        title: 'خطأ غير متوقع',
        text: 'حدث عطل تقني غير متوقع. يرجى إبلاغ الدعم الفني',
        confirmButtonText: 'تم الإبلاغ',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-destructive/10"
          aria-label="حذف الطبق"
        >
          <Icon name="Trash2" className="h-4 w-4 text-destructive" />
        </Button>
      </DialogTrigger>

      <DialogContent
        className="border-destructive/30 bg-background/95 backdrop-blur-sm"
        role="dialog"
        aria-labelledby="deleteConfirmationHeading"
        dir="rtl"
      >
        <DialogTitle id="deleteConfirmationHeading">تأكيد الحذف النهائي للطبق المشهور</DialogTitle>

        <DialogHeader>
          <DialogTitle className="text-right text-xl font-bold text-destructive">
            ⚠️ تأكيد الحذف النهائي
          </DialogTitle>

          <DialogDescription className="text-right text-sm text-muted-foreground/90">
            سيتم حذف الطبق المشهور بشكل دائم من هذا المطبخ.
          </DialogDescription>

          <div className="text-right text-muted-foreground/90">
            <p>هل أنت متأكد من رغبتك في المتابعة؟</p>
          </div>
        </DialogHeader>

        <DialogFooter className="flex flex-row-reverse gap-3">
          <DialogClose asChild>
            <Button
              variant="secondary"
              className="bg-muted/80 hover:bg-accent"
              aria-label="إلغاء عملية الحذف"
            >
              إلغاء الحذف
            </Button>
          </DialogClose>

          <Button
            onClick={handleDelete}
            disabled={isProcessing}
            className="bg-destructive/90 text-destructive-foreground hover:bg-destructive"
            aria-describedby="deleteConfirmationHeading"
          >
            {isProcessing ? (
              <>
                <Icon name="Loader2" className="ml-2 h-4 w-4 animate-spin" aria-hidden />
                <span>جارِ تنفيذ العملية...</span>
              </>
            ) : (
              'تأكيد الحذف الدائم'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

