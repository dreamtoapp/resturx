
export const revalidate = 60;

import {
  Metadata
} from 'next';
import { notFound } from 'next/navigation';

import { auth } from '@/auth';
import IncrementPreviewOnView from '../compnents/IncrementPreviewOnView';
import { Separator } from '@/components/ui/separator';

// Import all separated components
import ProductImageSection from '../compnents/ProductImageSection';
import ProductInfoSection from '../compnents/ProductInfoSection';
import ProductPriceSection from '../compnents/ProductPriceSection';
import ProductDescription from '../compnents/ProductDescription';
import ProductActionsSection from '../compnents/ProductActionsSection';
import ProductTabs from '../compnents/ProductTabs';
import RelatedProductsSection from '../compnents/RelatedProductsSection';

import {
  getProductBySlug,
  getProductReviews,
} from '../actions/actions';
import { PageProps } from '@/types/commonTypes';
import { formatCurrency, CurrencyCode } from '@/lib/formatCurrency';
import db from '@/lib/prisma';

// SEO helpers
import { buildCanonical } from '@/helpers/seo/canonical';
import { buildProductJsonLd } from '@/helpers/seo/jsonld/product';
import { buildBreadcrumbJsonLd } from '@/helpers/seo/jsonld/breadcrumb';

// --- Metadata ---
export async function generateMetadata({ params }: PageProps<{ slug: string }>): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return {
      title: 'المنتج غير موجود | المتجر الإلكتروني',
      description: 'عذراً، المنتج الذي تبحث عنه غير موجود',
    };
  }
  const canonical = await buildCanonical(`/product/${slug}`);
  return {
    title: `${product.name} | المتجر الإلكتروني`,
    description: product.details || 'تفاصيل المنتج في المتجر الإلكتروني',
    alternates: { canonical },
    robots: 'max-image-preview:large',
    openGraph: {
      title: product.name,
      description: product.details || 'تفاصيل المنتج في المتجر الإلكتروني',
      images: [
        {
          url: product.imageUrl || '/fallback/product-fallback.avif',
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
      type: 'website',
      siteName: 'المتجر الإلكتروني',
      locale: 'ar_SA',
      url: canonical,
    },
  };
}

// --- Main Page ---
export default async function ProductPage({ params }: PageProps<{ slug: string }>) {
  const { slug } = await params;
  const session = await auth();
  const product = await getProductBySlug(slug);
  if (!product) return notFound();
  const reviews = await getProductReviews(product.id);

  // Get company currency setting
  const company = await db.company.findFirst();
  const currency = (company?.defaultCurrency || 'SAR') as CurrencyCode;

  const formattedPrice = formatCurrency(product.price, currency);
  const discountPercentage = 0;
  const formattedSalePrice = null;
  const mainImage = product.imageUrl || '/fallback/product-fallback.avif';
  const additionalImages = product.images?.filter((img: string) => img !== mainImage) || [];

  // Structured data for Product + Breadcrumbs (include category when available)
  const productJsonLd = await buildProductJsonLd(product as any);
  const canonical = await buildCanonical(`/product/${slug}`);
  const categoryCrumb = product?.categorySlug
    ? { name: product.categorySlug as string, url: await buildCanonical(`/categories/${product.categorySlug}`) }
    : null;
  const breadcrumbItems = [
    { name: 'الرئيسية', url: canonical.replace(/\/product\/.+$/, '/') },
    ...(categoryCrumb ? [categoryCrumb] as { name: string; url: string }[] : []),
    { name: product.name as string, url: canonical },
  ];
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbItems);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <IncrementPreviewOnView productId={product.id} />
      <div className='container mx-auto px-4 py-8 max-w-7xl'>
        {/* Main Product Section */}
        <div className='grid grid-cols-1 mx-auto lg:grid-cols-2 gap-8 lg:gap-12 items-start justify-items-center lg:justify-items-start'>
          {/* Product Image */}
          <div className='sticky top-4 w-full max-w-md lg:max-w-none'>
            <ProductImageSection mainImage={mainImage} additionalImages={additionalImages} />
          </div>

          {/* Product Details */}
          <div className='space-y-8 w-full max-w-md lg:max-w-none text-center lg:text-start'>
            <ProductInfoSection product={product} />
            <ProductPriceSection formattedPrice={formattedPrice} formattedSalePrice={formattedSalePrice} discountPercentage={discountPercentage} />
            <Separator className='my-6' />
            <ProductDescription product={product} />
            <ProductActionsSection product={product} />
          </div>
        </div>

        {/* Product Tabs */}
        <div className='mt-16'>
          <ProductTabs product={product} reviews={reviews} session={session} mainImage={mainImage} />
        </div>

        {/* Related Products */}
        <div className='mt-20'>
          <RelatedProductsSection product={product} />
        </div>
      </div>
    </>
  );
}
