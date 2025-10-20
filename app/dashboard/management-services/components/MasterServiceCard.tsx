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
import { deleteMasterService } from '../actions/deleteMasterService';
import { toast } from 'sonner';
import MasterServiceUpsert from './MasterServiceUpsert';

interface MasterServiceCardProps {
  service: {
    id: string;
    name: string;
    nameEn?: string | null;
    imageUrl?: string | null;
    description?: string | null;
    category?: string | null;
    displayOrder: number;
    isActive: boolean;
    _count: {
      restaurants: number;
    };
  };
}

export default function MasterServiceCard({ service }: MasterServiceCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteMasterService(service.id);
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
          {service.imageUrl && (
            <div className="w-full h-32 mb-3 rounded-lg overflow-hidden bg-muted">
              <Image
                src={service.imageUrl}
                alt={service.name}
                width={200}
                height={128}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base truncate">{service.name}</h3>
              {service.nameEn && (
                <p className="text-xs text-muted-foreground truncate">{service.nameEn}</p>
              )}
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Badge variant={service.isActive ? 'default' : 'secondary'} className="text-xs">
                {service.isActive ? 'نشط' : 'غير نشط'}
              </Badge>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-2 mb-4">
            {service.category && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Icon name="Tag" className="h-3 w-3" />
                <span>{service.category}</span>
              </div>
            )}
            {service.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {service.description}
              </p>
            )}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Icon name="Store" className="h-3 w-3" />
              <span>مستخدم في {service._count.restaurants} مطعم</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <MasterServiceUpsert
              mode="update"
              title="تعديل الخدمة"
              description="تعديل بيانات الخدمة"
              defaultValues={{
                id: service.id,
                name: service.name,
                nameEn: service.nameEn || '',
                imageUrl: service.imageUrl || '',
                description: service.description || '',
                category: service.category || '',
                displayOrder: service.displayOrder,
                isActive: service.isActive,
              }}
            />
            <Button
              variant="destructive"
              size="sm"
              className="flex-1"
              onClick={() => setShowDeleteDialog(true)}
              disabled={service._count.restaurants > 0}
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
              هل أنت متأكد من حذف الخدمة &quot;{service.name}&quot;؟ هذا الإجراء لا يمكن التراجع عنه.
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




