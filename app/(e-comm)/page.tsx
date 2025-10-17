import dynamic from 'next/dynamic';
import BackToTopButton from '@/components/BackToTopButton';
import { getCachedProductsPage } from './homepage/actions/fetchProductsPage';
import CuisineList from './homepage/component/cuisine/CuisineList';
import RestaurantList from './homepage/component/restaurant/RestaurantList';
import FeaturedPromotions from './homepage/component/offer/FeaturedPromotions';
import { SWRConfig } from 'swr';
import ProductInfiniteGrid from './homepage/component/ProductInfiniteGrid';
import { companyInfo } from './actions/companyDetail';
import HomepageHeroSlider from './homepage/component/slider/HomepageHeroSlider';

// SEO helpers
import type { Metadata } from 'next';
import { buildMetadata } from '@/helpers/seo/metadata';
import { buildItemListJsonLd } from '@/helpers/seo/jsonld/itemList';
import { buildCanonical } from '@/helpers/seo/canonical';
import { Badge } from '@/components/ui/badge';

const PAGE_SIZE = 8;

const CriticalCSS = dynamic(() => import('./homepage/component/CriticalCSS'), { ssr: true });

export async function generateMetadata(): Promise<Metadata> {
  const company = await companyInfo();
  const title = company?.fullName || 'المتجر الإلكتروني';
  const description = company?.bio || 'تسوق أفضل المنتجات بخصومات مميزة.';
  return buildMetadata({ title, description, canonicalPath: '/' });
}

export default async function HomePage(props: { searchParams: Promise<{ slug?: string; page?: string; search?: string; description?: string; price?: string; category?: string; priceMin?: string; priceMax?: string }> }) {
  const searchParams = await props.searchParams;
  const slug = searchParams?.slug || '';
  const page = parseInt(searchParams?.page || '1', 10);
  const priceMin = searchParams?.priceMin ? Number(searchParams.priceMin) : undefined;
  const priceMax = searchParams?.priceMax ? Number(searchParams.priceMax) : undefined;
  const filters = {
    categorySlug: slug || searchParams?.category || '',
    search: searchParams?.search || '',
    description: searchParams?.description || '',
    priceMin,
    priceMax,
  };

  // Fetch company data for logo
  const company = await companyInfo();
  const logo = company?.logo || '/fallback/dreamToApp2-dark.png';
  const { products, total } = await getCachedProductsPage({ ...filters, page, pageSize: PAGE_SIZE }) as {
    products: any[];
    total: number;
    totalPages: number;
    currentPage: number;
  };

  // (Counter rendered inside CuisineList header)
  const firstPageKey = `/api/products-grid?page=1&slug=${encodeURIComponent(slug)}&pageSize=${PAGE_SIZE}`;

  // Build ItemList JSON-LD for first page products
  const base = await buildCanonical('/');
  const itemList = buildItemListJsonLd(
    products.slice(0, Math.min(products.length, 12)).map((p, idx) => ({
      position: idx + 1,
      url: `${base}product/${p.slug}`,
      name: p.name,
      image: p.imageUrl,
    }))
  );

  // WebPage JSON-LD for homepage
  const webPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: company?.fullName || 'المتجر الإلكتروني',
    url: base,
    inLanguage: 'ar',
    isPartOf: {
      '@type': 'WebSite',
      name: company?.fullName || 'Store',
      url: base,
    },
  };

  return (
    <>
      {/* Structured data for homepage WebPage and ItemList */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      <CriticalCSS />
      {company?.showHeroImage && Array.isArray(company?.heroSlides) && company.heroSlides.length > 0 ? (
        <HomepageHeroSlider
          slides={company.heroSlides.map((s: any, idx: number) => ({
            id: `hero-${idx}`,
            header: undefined,
            subheader: undefined,
            imageUrl: s.url,
            ctaText: 'تسوق الآن',
            ctaLink: '/cuisines',
            isActive: true,
          }))}
        />
      ) : null}
      <div className='container mx-auto flex flex-col gap-8 bg-background text-foreground px-4 sm:px-6 lg:px-8'>
        {/* Brief intro for SEO/context without altering layout significantly */}
        <p className="text-sm text-muted-foreground mt-4">
          تسوق أحدث العروض والتصنيفات المختارة بعناية للحصول على أفضل المنتجات بأسعار تنافسية.
        </p>
        <section className="space-y-6" aria-label="Featured promotions">
          <FeaturedPromotions />
        </section>
        <section className="space-y-6" aria-label="Cuisine categories">
          <CuisineList />
        </section>
        <section className="space-y-6" aria-label="Featured restaurants">
          <RestaurantList />
        </section>
        <section className="space-y-6" aria-label="Featured products">
          <h2 className="text-xl font-semibold flex items-center gap-2">المنتجات <Badge variant="outline">{total}</Badge></h2>
          <SWRConfig value={{ fallback: { [firstPageKey]: { products } } }}>
            <ProductInfiniteGrid initialProducts={products} filters={filters} logo={logo} />
          </SWRConfig>
        </section>
        <BackToTopButton />
      </div>
    </>
  );
}
