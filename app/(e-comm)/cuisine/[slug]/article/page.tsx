import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageProps } from '@/types/commonTypes';
import { Icon } from '@/components/icons/Icon';
import { buildMetadata } from '@/helpers/seo/metadata';
import { buildCanonical } from '@/helpers/seo/canonical';
import { getCuisineArticle } from '../../actions/getCuisineArticle';

export const revalidate = 3600; // Revalidate every hour

export async function generateMetadata({ params }: PageProps<{ slug: string }>): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const cuisine = await getCuisineArticle(slug);

  if (!cuisine) {
    return { title: 'Article Not Found' };
  }

  const title = cuisine.articleTitle || `${cuisine.name} - دليل شامل`;
  const description = cuisine.metaDescription || cuisine.description || `اكتشف تفاصيل ${cuisine.name} وأشهر الأطباق`;

  return buildMetadata({
    title,
    description,
    canonicalPath: `/cuisine/${decodedSlug}/article`
  });
}

export default async function CuisineArticlePage({ params }: PageProps<{ slug: string }>) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const cuisine = await getCuisineArticle(slug);

  if (!cuisine) {
    notFound();
  }

  // If no article exists, show message
  if (!cuisine.article || !cuisine.publishedAt) {
    return (
      <div className="container mx-auto py-8 px-4 space-y-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-foreground">الرئيسية</Link>
          <Icon name="ChevronRight" className="h-4 w-4" />
          <Link href="/cuisines" className="hover:text-foreground">المطابخ</Link>
          <Icon name="ChevronRight" className="h-4 w-4" />
          <span className="text-foreground">{cuisine.name} - المقالة</span>
        </nav>

        <div className="text-center py-16">
          <Icon name="BookOpen" className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">لا توجد مقالة متاحة</h1>
          <p className="text-muted-foreground mb-6">المقالة لهذا المطبخ غير متوفرة حالياً</p>
          <Link
            href="/cuisines"
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            <Icon name="ArrowRight" className="h-4 w-4" />
            العودة إلى المطابخ
          </Link>
        </div>
      </div>
    );
  }

  const canonical = await buildCanonical(`/cuisine/${decodedSlug}/article`);

  // Article JSON-LD structured data
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: cuisine.articleTitle || cuisine.name,
    description: cuisine.metaDescription || cuisine.description,
    image: cuisine.logo,
    datePublished: cuisine.publishedAt.toISOString(),
    dateModified: cuisine.updatedAt.toISOString(),
    author: {
      '@type': 'Organization',
      name: 'ResturX',
    },
    publisher: {
      '@type': 'Organization',
      name: 'ResturX',
      logo: {
        '@type': 'ImageObject',
        url: canonical.replace(/\/cuisine\/.*/, '') + '/icons/icon-512x512.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonical,
    },
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <div className="container mx-auto py-8 px-4 space-y-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-foreground">الرئيسية</Link>
          <Icon name="ChevronRight" className="h-4 w-4" />
          <Link href="/cuisines" className="hover:text-foreground">المطابخ</Link>
          <Icon name="ChevronRight" className="h-4 w-4" />
          <span className="text-foreground">{cuisine.name} - المقالة</span>
        </nav>

        {/* Hero Header */}
        <header className="flex flex-col md:flex-row items-center gap-6 bg-gradient-to-br from-primary/5 to-primary/10 p-8 rounded-2xl">
          {cuisine.logo && (
            <div className="relative w-32 h-32 flex-shrink-0">
              <Image
                src={cuisine.logo}
                alt={`${cuisine.name} flag`}
                fill
                className="object-contain"
                priority
              />
            </div>
          )}
          <div className="flex-1 text-center md:text-right space-y-2">
            <h1 className="text-4xl font-bold text-foreground">
              {cuisine.articleTitle || cuisine.name}
            </h1>
            {cuisine.description && (
              <p className="text-lg text-muted-foreground">{cuisine.description}</p>
            )}
          </div>
        </header>

        {/* Article Content */}
        <article className="prose prose-lg max-w-none bg-card p-8 rounded-xl border">
          <div
            dangerouslySetInnerHTML={{ __html: cuisine.article }}
            className="text-foreground leading-relaxed space-y-6"
          />
          <p className="text-sm text-muted-foreground mt-8 pt-4 border-t">
            آخر تحديث: {new Date(cuisine.publishedAt).toLocaleDateString('ar-SA', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </article>

        {/* Navigation Links */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between pt-8 border-t">
          <Link
            href="/cuisines"
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            <Icon name="ArrowRight" className="h-4 w-4" />
            العودة إلى المطابخ
          </Link>
          <Link
            href={`/cuisine/${decodedSlug}/popular-dishes`}
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            <Icon name="UtensilsCrossed" className="h-4 w-4" />
            تصفح الأطباق المشهورة
          </Link>
        </div>
      </div>
    </>
  );
}

