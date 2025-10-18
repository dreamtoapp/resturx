import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from '@/components/link';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icons/Icon';
import { getRestaurantBlog } from './actions/getRestaurantBlog';
import BlogContent from './components/BlogContent';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const restaurant = await getRestaurantBlog(slug);

  if (!restaurant || !restaurant.post) {
    return {
      title: 'Blog Not Found',
    };
  }

  const { post } = restaurant;
  
  return {
    title: `${post.title} | مدونة ${restaurant.name}`,
    description: post.excerpt || post.content.substring(0, 160),
    openGraph: {
      title: post.title,
      description: post.excerpt || post.content.substring(0, 160),
      images: post.imageUrl ? [post.imageUrl] : restaurant.imageUrl ? [restaurant.imageUrl] : [],
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
      authors: [restaurant.name],
      siteName: 'RestaurX',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || post.content.substring(0, 160),
      images: post.imageUrl ? [post.imageUrl] : restaurant.imageUrl ? [restaurant.imageUrl] : [],
    },
    keywords: [
      restaurant.name,
      'مطعم',
      'مدونة',
      'قصة نجاح',
      'أخبار المطعم',
    ],
  };
}

export default async function RestaurantBlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const restaurant = await getRestaurantBlog(slug);

  if (!restaurant || !restaurant.post) {
    notFound();
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mb-8">
        <Link href={`/restaurant/${restaurant.slug}`}>
          <Button variant="ghost">
            <Icon name="ArrowRight" className="h-4 w-4 ml-2" />
            العودة للمطعم
          </Button>
        </Link>
      </div>

      {/* Blog Content */}
      <BlogContent
        post={restaurant.post}
        restaurant={restaurant}
      />

      {/* Back to Restaurant Button (bottom) */}
      <div className="mt-12 pt-8 border-t">
        <Link href={`/restaurant/${restaurant.slug}`}>
          <Button variant="outline" className="w-full sm:w-auto">
            <Icon name="Store" className="h-4 w-4 ml-2" />
            زيارة صفحة المطعم
          </Button>
        </Link>
      </div>
    </div>
  );
}

