'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Icon } from '@/components/icons/Icon';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { addVideo } from '../actions/addVideo';
import { updateVideo } from '../actions/updateVideo';
import { deleteVideo } from '../actions/deleteVideo';
import { reorderVideos } from '../actions/reorderVideos';
import VideoFormModal from './VideoFormModal';

interface RestaurantVideo {
  id: string;
  youtubeUrl: string;
  videoId: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  order: number;
  createdAt: Date;
}

interface VideoManagerProps {
  restaurantId: string;
  videos: RestaurantVideo[];
}

export default function VideoManager({ videos: initialVideos }: VideoManagerProps) {
  const [videos, setVideos] = useState<RestaurantVideo[]>(initialVideos);
  const [isPending, startTransition] = useTransition();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState<string | null>(null);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<RestaurantVideo | null>(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewVideo, setPreviewVideo] = useState<RestaurantVideo | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleAddVideo = async (youtubeUrl: string, title: string, description?: string) => {
    // videoId is ignored for new videos (always empty string from form)
    startTransition(async () => {
      const result = await addVideo(youtubeUrl, title, description);

      if (result.success) {
        toast.success(result.message);
        setFormModalOpen(false);
        // Refresh - in real app would optimistically add
        window.location.reload();
      } else {
        toast.error(result.message);
      }
    });
  };

  const handleUpdateVideo = async (videoId: string, youtubeUrl: string, title: string, description?: string) => {
    startTransition(async () => {
      const result = await updateVideo(videoId, youtubeUrl, title, description);

      if (result.success) {
        toast.success(result.message);
        setFormModalOpen(false);
        setEditingVideo(null);
        // Refresh
        window.location.reload();
      } else {
        toast.error(result.message);
      }
    });
  };

  const openAddModal = () => {
    setEditingVideo(null);
    setFormModalOpen(true);
  };

  const openEditModal = (video: RestaurantVideo) => {
    setEditingVideo(video);
    setFormModalOpen(true);
  };

  const confirmDelete = (videoId: string) => {
    setVideoToDelete(videoId);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!videoToDelete) return;

    startTransition(async () => {
      const result = await deleteVideo(videoToDelete);

      if (result.success) {
        toast.success(result.message);
        setVideos(videos.filter(v => v.id !== videoToDelete));
      } else {
        toast.error(result.message);
      }

      setDeleteDialogOpen(false);
      setVideoToDelete(null);
    });
  };

  const openPreview = (video: RestaurantVideo) => {
    setPreviewVideo(video);
    setPreviewDialogOpen(true);
  };

  // Drag and drop handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === index) return;

    const newVideos = [...videos];
    const draggedVideo = newVideos[draggedIndex];

    // Remove from old position
    newVideos.splice(draggedIndex, 1);
    // Insert at new position
    newVideos.splice(index, 0, draggedVideo);

    setVideos(newVideos);
    setDraggedIndex(index);
  };

  const handleDragEnd = async () => {
    if (draggedIndex === null) return;

    // Save new order to server
    const videoIds = videos.map(v => v.id);

    startTransition(async () => {
      const result = await reorderVideos(videoIds);

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
        // Revert to original order on error
        setVideos(initialVideos);
      }
    });

    setDraggedIndex(null);
  };

  const MAX_VIDEOS = 5;
  const canAddMore = videos.length < MAX_VIDEOS;

  return (
    <div className="space-y-6">
      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Add Video Card */}
        {canAddMore && (
          <Card className="border-dashed border-2 hover:border-primary transition-colors">
            <CardContent className="p-0">
              <button
                onClick={openAddModal}
                disabled={isPending}
                className="aspect-video w-full flex flex-col items-center justify-center hover:bg-muted/50 transition-colors group"
              >
                <Icon name="Plus" className="h-12 w-12 text-muted-foreground group-hover:text-primary transition-colors" />
                <p className="text-sm text-muted-foreground mt-2">إضافة فيديو</p>
                <p className="text-xs text-muted-foreground mt-1">
                  ({videos.length}/{MAX_VIDEOS})
                </p>
              </button>
            </CardContent>
          </Card>
        )}

        {/* Video Cards */}
        {videos.map((video, index) => (
          <Card
            key={video.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`group cursor-move hover:shadow-lg transition-all ${draggedIndex === index ? 'opacity-50 scale-95' : ''
              }`}
          >
            <CardContent className="p-0">
              {/* Thumbnail */}
              <div className="aspect-video relative">
                <Image
                  src={video.thumbnailUrl || `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
                  alt={video.title}
                  fill
                  className="object-cover rounded-t-lg cursor-pointer"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  onClick={() => openPreview(video)}
                />

                {/* Play Overlay */}
                <div
                  onClick={() => openPreview(video)}
                  className="absolute inset-0 flex items-center justify-center bg-transparent hover:bg-black/20 transition-all cursor-pointer group/play"
                >
                  <div className="w-12 h-12 bg-red-600/90 rounded-full flex items-center justify-center group-hover/play:bg-red-600 group-hover/play:scale-105 transition-all shadow-xl">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5 text-white fill-current"
                      style={{ marginLeft: '2px' }}
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>

                {/* Order Badge */}
                <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded z-10">
                  #{index + 1}
                </div>

                {/* Action Buttons */}
                <div className="absolute top-2 left-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(video);
                    }}
                    disabled={isPending}
                    className="bg-primary/90 hover:bg-primary text-primary-foreground p-2 rounded-full"
                    title="تعديل الفيديو"
                  >
                    <Icon name="Edit" className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      confirmDelete(video.id);
                    }}
                    disabled={isPending}
                    className="bg-destructive/90 hover:bg-destructive text-destructive-foreground p-2 rounded-full"
                    title="حذف الفيديو"
                  >
                    <Icon name="Trash2" className="h-4 w-4" />
                  </button>
                </div>

                {/* Drag Handle */}
                <div className="absolute bottom-2 right-2 bg-black/70 text-white p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <Icon name="GripVertical" className="h-4 w-4" />
                </div>
              </div>

              {/* Video Info */}
              <div className="p-4">
                <h3 className="font-semibold text-sm line-clamp-2 mb-1">{video.title}</h3>
                {video.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">{video.description}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {videos.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Icon name="Video" className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">لا توجد فيديوهات</h3>
            <p className="text-muted-foreground mb-4">
              ابدأ بإضافة فيديوهات YouTube لجذب المزيد من العملاء
            </p>
            <Button onClick={openAddModal}>
              <Icon name="Plus" className="h-4 w-4 ml-2" />
              إضافة أول فيديو
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Video Form Modal */}
      <VideoFormModal
        open={formModalOpen}
        onClose={() => {
          setFormModalOpen(false);
          setEditingVideo(null);
        }}
        onSubmit={editingVideo ? handleUpdateVideo : handleAddVideo}
        video={editingVideo}
        isPending={isPending}
      />

      {/* Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{previewVideo?.title}</DialogTitle>
            {previewVideo?.description && (
              <DialogDescription>{previewVideo.description}</DialogDescription>
            )}
          </DialogHeader>
          {previewVideo && (
            <div className="aspect-video w-full">
              <iframe
                src={`https://www.youtube.com/embed/${previewVideo.videoId}`}
                title={previewVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-lg"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من حذف هذا الفيديو؟ لا يمكن التراجع عن هذا الإجراء.
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

