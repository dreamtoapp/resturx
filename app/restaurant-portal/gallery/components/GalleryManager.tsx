'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Icon } from '@/components/icons/Icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { addGalleryImage } from '../actions/addGalleryImage';
import { deleteGalleryImage } from '../actions/deleteGalleryImage';
import { updateImageCaption } from '../actions/updateImageCaption';
import { reorderImages } from '../actions/reorderImages';

interface GalleryImage {
  id: string;
  imageUrl: string;
  caption: string | null;
  order: number;
  createdAt: Date;
}

interface GalleryManagerProps {
  restaurantId: string;
  images: GalleryImage[];
}

export default function GalleryManager({ images: initialImages }: GalleryManagerProps) {
  const [images, setImages] = useState<GalleryImage[]>(initialImages);
  const [isPending, startTransition] = useTransition();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const [editingCaption, setEditingCaption] = useState<string | null>(null);
  const [captionValue, setCaptionValue] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (imageUrl: string) => {
    setUploadingImage(true);
    startTransition(async () => {
      const result = await addGalleryImage(imageUrl);

      if (result.success) {
        toast.success(result.message);
        // Optimistically add image to the list
        const newImage: GalleryImage = {
          id: result.imageId!,
          imageUrl,
          caption: null,
          order: images.length,
          createdAt: new Date(),
        };
        setImages([...images, newImage]);
      } else {
        toast.error(result.message);
      }
      setUploadingImage(false);
    });
  };

  const confirmDelete = (imageId: string) => {
    setImageToDelete(imageId);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!imageToDelete) return;

    startTransition(async () => {
      const result = await deleteGalleryImage(imageToDelete);

      if (result.success) {
        toast.success(result.message);
        setImages(images.filter(img => img.id !== imageToDelete));
      } else {
        toast.error(result.message);
      }

      setDeleteDialogOpen(false);
      setImageToDelete(null);
    });
  };

  const startEditCaption = (image: GalleryImage) => {
    setEditingCaption(image.id);
    setCaptionValue(image.caption || '');
  };

  const saveCaption = async (imageId: string) => {
    startTransition(async () => {
      const result = await updateImageCaption(imageId, captionValue);

      if (result.success) {
        toast.success(result.message);
        setImages(images.map(img =>
          img.id === imageId ? { ...img, caption: captionValue.trim() || null } : img
        ));
        setEditingCaption(null);
      } else {
        toast.error(result.message);
      }
    });
  };

  const cancelEditCaption = () => {
    setEditingCaption(null);
    setCaptionValue('');
  };

  // Drag and drop handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];

    // Remove from old position
    newImages.splice(draggedIndex, 1);
    // Insert at new position
    newImages.splice(index, 0, draggedImage);

    setImages(newImages);
    setDraggedIndex(index);
  };

  const handleDragEnd = async () => {
    if (draggedIndex === null) return;

    // Save new order to server
    const imageIds = images.map(img => img.id);

    startTransition(async () => {
      const result = await reorderImages(imageIds);

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
        // Revert to original order on error
        setImages(initialImages);
      }
    });

    setDraggedIndex(null);
  };

  const MAX_IMAGES = 20;
  const canAddMore = images.length < MAX_IMAGES;

  return (
    <div className="space-y-6">
      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Add Image Card */}
        {canAddMore && (
          <Card className="border-dashed border-2 hover:border-primary transition-colors">
            <CardContent className="p-0">
              <div className="aspect-square relative">
                {/* Using a simple file upload approach since AddImage needs recordId for existing records */}
                <label
                  htmlFor="gallery-upload"
                  className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors group"
                >
                  <Icon name="Plus" className="h-12 w-12 text-muted-foreground group-hover:text-primary transition-colors" />
                  <p className="text-sm text-muted-foreground mt-2">إضافة صورة</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    ({images.length}/{MAX_IMAGES})
                  </p>
                  <input
                    id="gallery-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingImage || isPending}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      // Validate file size (5MB)
                      if (file.size > 5 * 1024 * 1024) {
                        toast.error('حجم الصورة كبير جدًا. الحد الأقصى 5MB');
                        return;
                      }

                      setUploadingImage(true);

                      try {
                        // Upload to API
                        const formData = new FormData();
                        formData.append('file', file);
                        formData.append('table', 'restaurant');
                        formData.append('uploadOnly', 'true');

                        const response = await fetch('/api/images', {
                          method: 'POST',
                          body: formData,
                        });

                        const data = await response.json();

                        if (response.ok && data.imageUrl) {
                          await handleImageUpload(data.imageUrl);
                        } else {
                          toast.error(data.error?.message || 'فشل رفع الصورة');
                        }
                      } catch (error) {
                        toast.error('حدث خطأ أثناء رفع الصورة');
                      } finally {
                        setUploadingImage(false);
                        e.target.value = ''; // Reset input
                      }
                    }}
                  />
                </label>
                {uploadingImage && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                    <Icon name="Loader2" className="h-8 w-8 animate-spin text-white" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Image Cards */}
        {images.map((image, index) => (
          <Card
            key={image.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`group cursor-move hover:shadow-lg transition-all ${draggedIndex === index ? 'opacity-50 scale-95' : ''
              }`}
          >
            <CardContent className="p-0">
              {/* Image */}
              <div className="aspect-square relative">
                <Image
                  src={image.imageUrl}
                  alt={image.caption || 'صورة المطعم'}
                  fill
                  className="object-cover rounded-t-lg"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Order Badge */}
                <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  #{index + 1}
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => confirmDelete(image.id)}
                  disabled={isPending}
                  className="absolute top-2 left-2 bg-destructive/90 hover:bg-destructive text-destructive-foreground p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                  title="حذف الصورة"
                >
                  <Icon name="Trash2" className="h-4 w-4" />
                </button>

                {/* Drag Handle */}
                <div className="absolute bottom-2 right-2 bg-black/70 text-white p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  <Icon name="GripVertical" className="h-4 w-4" />
                </div>
              </div>

              {/* Caption */}
              <div className="p-3">
                {editingCaption === image.id ? (
                  <div className="space-y-2">
                    <Input
                      value={captionValue}
                      onChange={(e) => setCaptionValue(e.target.value)}
                      placeholder="أضف تعليقاً..."
                      maxLength={200}
                      disabled={isPending}
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          saveCaption(image.id);
                        } else if (e.key === 'Escape') {
                          cancelEditCaption();
                        }
                      }}
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => saveCaption(image.id)}
                        disabled={isPending}
                      >
                        <Icon name="Check" className="h-4 w-4 ml-1" />
                        حفظ
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={cancelEditCaption}
                        disabled={isPending}
                      >
                        إلغاء
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => startEditCaption(image)}
                    className="cursor-pointer hover:bg-muted/50 rounded p-2 -m-2 transition-colors min-h-[40px] flex items-center"
                    title="انقر للتعديل"
                  >
                    {image.caption ? (
                      <p className="text-sm text-foreground line-clamp-2">{image.caption}</p>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">انقر لإضافة تعليق...</p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {images.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Icon name="Image" className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">لا توجد صور في المعرض</h3>
            <p className="text-muted-foreground mb-4">
              ابدأ بإضافة صور جذابة لمطعمك لجذب المزيد من العملاء
            </p>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من حذف هذه الصورة؟ لا يمكن التراجع عن هذا الإجراء.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isPending}
            >
              إلغاء
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Icon name="Loader2" className="h-4 w-4 ml-2 animate-spin" />
                  جاري الحذف...
                </>
              ) : (
                <>
                  <Icon name="Trash2" className="h-4 w-4 ml-2" />
                  حذف
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


