'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/icons/Icon';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface RestaurantVideo {
  id: string;
  videoId: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
}

interface RestaurantVideosTabProps {
  videos: RestaurantVideo[];
  restaurantName: string;
}

export default function RestaurantVideosTab({ videos }: RestaurantVideosTabProps) {
  const [selectedVideo, setSelectedVideo] = useState<RestaurantVideo | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const openVideo = (video: RestaurantVideo) => {
    setSelectedVideo(video);
    setDialogOpen(true);
  };

  const closeVideo = () => {
    setSelectedVideo(null);
    setDialogOpen(false);
  };

  if (!videos || videos.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Icon name="Video" className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">لا توجد فيديوهات متاحة</p>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div key={video.id} className="group cursor-pointer" onClick={() => openVideo(video)}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              {/* Thumbnail */}
              <div className="aspect-video relative">
                <Image
                  src={video.thumbnailUrl || `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
                  alt={video.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Play Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-transparent group-hover:bg-black/20 transition-all">
                  <div className="w-12 h-12 bg-red-600/90 rounded-full flex items-center justify-center group-hover:bg-red-600 group-hover:scale-105 transition-all shadow-xl">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5 text-white fill-current"
                      style={{ marginLeft: '2px' }}
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Video Info */}
              <div className="p-4">
                <h3 className="font-semibold text-base line-clamp-2 mb-2">{video.title}</h3>
                {video.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{video.description}</p>
                )}
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* Video Modal */}
      <Dialog open={dialogOpen} onOpenChange={closeVideo}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>{selectedVideo?.title}</DialogTitle>
            {selectedVideo?.description && (
              <DialogDescription>{selectedVideo.description}</DialogDescription>
            )}
          </DialogHeader>
          {selectedVideo && (
            <div className="aspect-video w-full">
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1`}
                title={selectedVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-lg"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

