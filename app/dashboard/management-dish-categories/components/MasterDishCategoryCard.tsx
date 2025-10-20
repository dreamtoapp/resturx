'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icons/Icon';
import Image from 'next/image';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { deleteMasterDishCategory } from '../actions/deleteMasterDishCategory';
import { toast } from 'sonner';
import MasterDishCategoryUpsert from './MasterDishCategoryUpsert';

interface MasterDishCategoryCardProps {
  category: {
    id: string;
    name: string;
    nameEn?: string | null;
    imageUrl?: string | null;
    description?: string | null;
    displayOrder: number;
    isActive: boolean;
    _count: {
      dishes: number;
    };
  };
}

export default function MasterDishCategoryCard({ category }: MasterDishCategoryCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteMasterDishCategory(category.id);
    setIsDeleting(false);

    if (result.ok) {
      toast.success(result.msg);
      setShowDeleteDialog(false);
    } else {
      toast.error(result.msg);
    }
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <CardContent className="p-4">
          {/* Image/Icon */}
          {category.imageUrl && (
            <div className="w-full h-32 mb-3 rounded-lg overflow-hidden bg-muted">
              <Image
                src={category.imageUrl}
                alt={category.name}
                width={200}
                height={128}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base truncate">{category.name}</h3>
              {category.nameEn && (
                <p className="text-xs text-muted-foreground truncate">{category.nameEn}</p>
              )}
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Badge variant={category.isActive ? 'default' : 'secondary'} className="text-xs">
                {category.isActive ? 'نشط' : 'غير نشط'}
              </Badge>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-2 mb-4">
            {category.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {category.description}
              </p>
            )}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Icon name="UtensilsCrossed" className="h-3 w-3" />
              <span>مستخدم في {category._count.dishes} طبق</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <MasterDishCategoryUpsert
              mode="update"
              title="تعديل الصنف"
              description="تعديل بيانات الصنف"
              defaultValues={{
                id: category.id,
                name: category.name,
                nameEn: category.nameEn || '',
                imageUrl: category.imageUrl || '',
                description: category.description || '',
                displayOrder: category.displayOrder,
                isActive: category.isActive,
              }}
            />
            <Button
              variant="destructive"
              size="sm"
              className="flex-1"
              onClick={() => setShowDeleteDialog(true)}
              disabled={category._count.dishes > 0}
            >
              <Icon name="Trash2" className="h-4 w-4 ml-1" />
              حذف
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف الصنف &quot;{category.name}&quot;؟ هذا الإجراء لا يمكن التراجع عنه.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? 'جاري الحذف...' : 'حذف'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

