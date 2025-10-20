'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/icons/Icon';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { createTable, updateTable, deleteTable } from '../actions/tableActions';

interface Table {
  id: string;
  tableNumber: string;
  capacity: number;
  isActive: boolean;
  _count: {
    orders: number;
  };
}

interface TablesClientProps {
  initialTables: Table[];
}

export default function TablesClient({ initialTables }: TablesClientProps) {
  const [tables] = useState<Table[]>(initialTables);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [tableNumber, setTableNumber] = useState('');
  const [capacity, setCapacity] = useState('4');
  const [isActive, setIsActive] = useState(true);

  const resetForm = () => {
    setTableNumber('');
    setCapacity('4');
    setIsActive(true);
  };

  const handleAdd = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  const handleEdit = (table: Table) => {
    setSelectedTable(table);
    setTableNumber(table.tableNumber);
    setCapacity(table.capacity.toString());
    setIsActive(table.isActive);
    setIsEditDialogOpen(true);
  };

  const handleDeleteConfirm = (table: Table) => {
    setSelectedTable(table);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmitAdd = async () => {
    const cap = parseInt(capacity);
    if (isNaN(cap) || cap < 1) {
      toast.error('يرجى إدخال عدد مقاعد صحيح');
      return;
    }

    setIsSubmitting(true);
    const result = await createTable(tableNumber, cap);
    setIsSubmitting(false);

    if (result.success) {
      toast.success(result.message);
      setIsAddDialogOpen(false);
      resetForm();
      // Refresh page data
      window.location.reload();
    } else {
      toast.error(result.message);
    }
  };

  const handleSubmitEdit = async () => {
    if (!selectedTable) return;

    const cap = parseInt(capacity);
    if (isNaN(cap) || cap < 1) {
      toast.error('يرجى إدخال عدد مقاعد صحيح');
      return;
    }

    setIsSubmitting(true);
    const result = await updateTable(selectedTable.id, tableNumber, cap, isActive);
    setIsSubmitting(false);

    if (result.success) {
      toast.success(result.message);
      setIsEditDialogOpen(false);
      setSelectedTable(null);
      resetForm();
      // Refresh page data
      window.location.reload();
    } else {
      toast.error(result.message);
    }
  };

  const handleSubmitDelete = async () => {
    if (!selectedTable) return;

    setIsSubmitting(true);
    const result = await deleteTable(selectedTable.id);
    setIsSubmitting(false);

    if (result.success) {
      toast.success(result.message);
      setIsDeleteDialogOpen(false);
      setSelectedTable(null);
      // Refresh page data
      window.location.reload();
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">
          إجمالي الطاولات: <span className="font-semibold">{tables.length}</span>
        </p>
        <Button onClick={handleAdd}>
          <Icon name="Plus" className="h-4 w-4 mr-2" />
          إضافة طاولة
        </Button>
      </div>

      {/* Tables Grid */}
      {tables.length === 0 ? (
        <Card className="p-12 text-center">
          <Icon name="LayoutGrid" className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">لا توجد طاولات</h3>
          <p className="text-sm text-muted-foreground mb-4">
            ابدأ بإضافة طاولات المطعم
          </p>
          <Button onClick={handleAdd}>
            <Icon name="Plus" className="h-4 w-4 mr-2" />
            إضافة أول طاولة
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tables.map((table) => {
            const isOccupied = table._count.orders > 0;
            return (
              <Card key={table.id} className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">
                      طاولة {table.tableNumber}
                    </h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Icon name="Users" className="h-4 w-4" />
                      {table.capacity} مقاعد
                    </p>
                  </div>
                  <Badge
                    variant={isOccupied ? 'destructive' : 'default'}
                    className={!isOccupied ? 'bg-green-500' : ''}
                  >
                    {isOccupied ? 'مشغولة' : 'متاحة'}
                  </Badge>
                </div>

                {!table.isActive && (
                  <Badge variant="secondary" className="mb-3">
                    <Icon name="Ban" className="h-3 w-3 mr-1" />
                    غير نشطة
                  </Badge>
                )}

                {isOccupied && (
                  <p className="text-xs text-muted-foreground mb-3">
                    {table._count.orders} طلب نشط
                  </p>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(table)}
                    className="flex-1"
                  >
                    <Icon name="Pencil" className="h-4 w-4 mr-1" />
                    تعديل
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteConfirm(table)}
                    className="text-destructive hover:text-destructive"
                    disabled={isOccupied}
                  >
                    <Icon name="Trash2" className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة طاولة جديدة</DialogTitle>
            <DialogDescription>
              أدخل رقم الطاولة وعدد المقاعد
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="add-table-number">رقم الطاولة</Label>
              <Input
                id="add-table-number"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder="مثال: 1، A1، VIP-5"
              />
              <p className="text-xs text-muted-foreground mt-1">
                يمكن استخدام أرقام أو أحرف (مثل: 1، A1، VIP-5)
              </p>
            </div>
            <div>
              <Label htmlFor="add-capacity">عدد المقاعد</Label>
              <Input
                id="add-capacity"
                type="number"
                min="1"
                max="50"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddDialogOpen(false)}
              disabled={isSubmitting}
            >
              إلغاء
            </Button>
            <Button onClick={handleSubmitAdd} disabled={isSubmitting}>
              {isSubmitting ? 'جاري الإضافة...' : 'إضافة'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تعديل الطاولة</DialogTitle>
            <DialogDescription>
              تعديل بيانات الطاولة {selectedTable?.tableNumber}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-table-number">رقم الطاولة</Label>
              <Input
                id="edit-table-number"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder="مثال: 1، A1، VIP-5"
              />
            </div>
            <div>
              <Label htmlFor="edit-capacity">عدد المقاعد</Label>
              <Input
                id="edit-capacity"
                type="number"
                min="1"
                max="50"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="edit-active">الطاولة نشطة</Label>
              <Switch
                id="edit-active"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={isSubmitting}
            >
              إلغاء
            </Button>
            <Button onClick={handleSubmitEdit} disabled={isSubmitting}>
              {isSubmitting ? 'جاري الحفظ...' : 'حفظ'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف الطاولة</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف طاولة <strong>{selectedTable?.tableNumber}</strong>؟
              لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSubmitDelete}
              disabled={isSubmitting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isSubmitting ? 'جاري الحذف...' : 'حذف'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

