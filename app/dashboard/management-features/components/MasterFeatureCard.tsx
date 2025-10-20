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
import { deleteMasterFeature } from '../actions/deleteMasterFeature';
import { toast } from 'sonner';
import MasterFeatureUpsert from './MasterFeatureUpsert';

interface MasterFeatureCardProps {
  feature: {
    id: string;
    title: string;
    titleEn?: string | null;
    imageUrl?: string | null;
    description: string;
    category?: string | null;
    displayOrder: number;
    isActive: boolean;
    _count: {
      restaurants: number;
    };
  };
}

export default function MasterFeatureCard({ feature }: MasterFeatureCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteMasterFeature(feature.id);
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
          {feature.imageUrl && (
            <div className="w-full h-32 mb-3 rounded-lg overflow-hidden bg-muted">
              <Image
                src={feature.imageUrl}
                alt={feature.title}
                width={200}
                height={128}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base truncate">{feature.title}</h3>
              {feature.titleEn && (
                <p className="text-xs text-muted-foreground truncate">{feature.titleEn}</p>
              )}
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Badge variant={feature.isActive ? 'default' : 'secondary'} className="text-xs">
                {feature.isActive ? 'نشط' : 'غير نشط'}
              </Badge>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-2 mb-4">
            {feature.category && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Icon name="Tag" className="h-3 w-3" />
                <span>{feature.category}</span>
              </div>
            )}
            <p className="text-xs text-muted-foreground line-clamp-2">
              {feature.description}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Icon name="Store" className="h-3 w-3" />
              <span>مستخدم في {feature._count.restaurants} مطعم</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <MasterFeatureUpsert
              mode="update"
              title="تعديل الميزة"
              description="تعديل بيانات الميزة"
              defaultValues={{
                id: feature.id,
                title: feature.title,
                titleEn: feature.titleEn || '',
                imageUrl: feature.imageUrl || '',
                description: feature.description,
                category: feature.category || '',
                displayOrder: feature.displayOrder,
                isActive: feature.isActive,
              }}
            />
            <Button
              variant="destructive"
              size="sm"
              className="flex-1"
              onClick={() => setShowDeleteDialog(true)}
              disabled={feature._count.restaurants > 0}
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
              هل أنت متأكد من حذف الميزة &quot;{feature.title}&quot;؟ هذا الإجراء لا يمكن التراجع عنه.
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




