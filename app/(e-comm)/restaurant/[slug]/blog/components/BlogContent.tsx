import Image from 'next/image';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Icon } from '@/components/icons/Icon';

interface BlogContentProps {
  post: {
    title: string;
    content: string;
    excerpt?: string | null;
    imageUrl?: string | null;
    publishedAt?: Date | null;
    createdAt: Date;
  };
  restaurant: {
    name: string;
    imageUrl?: string | null;
  };
}

export default function BlogContent({ post, restaurant }: BlogContentProps) {
  const displayDate = post.publishedAt || post.createdAt;

  return (
    <article className="space-y-8">
      {/* Featured Image */}
      {post.imageUrl && (
        <div className="relative w-full aspect-[21/9] rounded-xl overflow-hidden">
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Title */}
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          {post.title}
        </h1>

        {/* Metadata */}
        <div className="flex items-center gap-4 text-muted-foreground">
          {/* Restaurant Info */}
          <div className="flex items-center gap-2">
            {restaurant.imageUrl && (
              <div className="relative w-8 h-8 rounded-full overflow-hidden">
                <Image
                  src={restaurant.imageUrl}
                  alt={restaurant.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <span className="font-medium">{restaurant.name}</span>
          </div>

          <span>•</span>

          {/* Date */}
          <div className="flex items-center gap-1">
            <Icon name="Calendar" className="h-4 w-4" />
            <span>{format(new Date(displayDate), 'dd MMMM yyyy', { locale: ar })}</span>
          </div>
        </div>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-xl text-muted-foreground leading-relaxed">
            {post.excerpt}
          </p>
        )}
      </div>

      {/* Divider */}
      <hr className="border-t-2" />

      {/* Content */}
      <div className="prose prose-lg max-w-none dark:prose-invert">
        <div className="whitespace-pre-wrap text-foreground leading-relaxed">
          {post.content}
        </div>
      </div>
    </article>
  );
}

