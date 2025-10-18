import { Metadata } from 'next';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icons/Icon';
import { Badge } from '@/components/ui/badge';
import BlogEditor from './components/BlogEditor';
import DeleteBlogButton from './components/DeleteBlogButton';
import AddImage from '@/components/AddImage';

export const metadata: Metadata = {
  title: 'إدارة المدونة | بوابة المطعم',
  description: 'أنشئ وشارك قصة مطعمك مع عملائك. اكتب مدونة احترافية لجذب المزيد من الزبائن.',
  robots: 'noindex, nofollow', // Private portal page
};

export default async function BlogManagementPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect('/login');
  }

  // Get restaurant and its blog post
  const restaurant = await prisma.restaurant.findFirst({
    where: { userId: session.user.id },
    include: {
      post: true
    }
  });

  if (!restaurant) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="p-8 text-center">
            <Icon name="AlertCircle" className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">لم يتم العثور على المطعم</h3>
            <p className="text-muted-foreground">
              لا يمكنك إدارة المدونة بدون مطعم مسجل
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">إدارة المدونة</h1>
        <p className="text-muted-foreground">
          أنشئ وشارك قصة مطعمك مع عملائك
        </p>
      </div>

      {/* Current Status */}
      {restaurant.post && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>الحالة الحالية</span>
              <Badge variant={restaurant.post.isPublished ? 'default' : 'secondary'}>
                {restaurant.post.isPublished ? (
                  <>
                    <Icon name="Eye" className="h-3 w-3 ml-1" />
                    منشورة
                  </>
                ) : (
                  <>
                    <Icon name="EyeOff" className="h-3 w-3 ml-1" />
                    مسودة
                  </>
                )}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-1">{restaurant.post.title}</h3>
              {restaurant.post.excerpt && (
                <p className="text-sm text-muted-foreground">{restaurant.post.excerpt}</p>
              )}
            </div>

            {/* Featured Image Upload */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">الصورة المميزة</h4>
                <Badge variant="outline" className="text-xs">
                  <Icon name="Share2" className="h-3 w-3 ml-1" />
                  للمشاركة الاجتماعية
                </Badge>
              </div>
              <div className="relative w-full aspect-[21/9] rounded-lg overflow-hidden border border-dashed border-muted-foreground/30 hover:border-primary/50 transition-colors">
                <AddImage
                  url={restaurant.post.imageUrl || undefined}
                  alt="صورة المدونة المميزة"
                  recordId={restaurant.post.id}
                  table="restaurantpost"
                  tableField="imageUrl"
                  folder="blog-images"
                  autoUpload={true}
                  imageFit="cover"
                  maxFileSizeMB={5}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                💡 هذه الصورة ستظهر عند مشاركة المدونة على فيسبوك، واتساب، تويتر
              </p>
            </div>

            <div className="flex gap-2">
              {restaurant.post.isPublished && (
                <a href={`/restaurant/${restaurant.slug}/blog`} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm">
                    <Icon name="ExternalLink" className="h-4 w-4 ml-2" />
                    عرض المدونة
                  </Button>
                </a>
              )}
              <DeleteBlogButton />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Editor */}
      <BlogEditor existingPost={restaurant.post} />
    </div>
  );
}

