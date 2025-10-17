import { Metadata } from 'next';
import Image from 'next/image';
import Link from '@/components/link';
import { Icon } from '@/components/icons/Icon';
import { getCategories } from '../../homepage/actions/getCategories';
import StickyBreadcrumb from '@/components/StickyBreadcrumb';

export const metadata: Metadata = {
    title: 'جميع المطابخ | دليل المطاعم',
    description: 'تصفح جميع أنواع المطابخ واكتشف أفضل المطاعم من مختلف أنحاء العالم'
};

export default async function CategoriesPage() {
    const categories = await getCategories();

    return (
        <div className="min-h-screen">
            <StickyBreadcrumb
                items={[
                    { label: 'الرئيسية', href: '/' },
                    { label: 'المطابخ' }
                ]}
            />

            {/* Spacer for fixed breadcrumb */}
            <div className="h-[44px]" aria-hidden="true" />

            <div className="container mx-auto py-8 px-4">

                <div className="mb-12 text-center">
                    <h1 className="mb-3 text-3xl font-bold md:text-4xl lg:text-5xl">
                        تصفح حسب نوع المطبخ
                    </h1>
                    <p className="mx-auto max-w-2xl text-muted-foreground">
                        اكتشف أفضل المطاعم من مختلف أنحاء العالم مصنفة حسب نوع المطبخ
                    </p>
                </div>

                {/* Categories section with featured category */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-12">
                    {categories.length > 0 && (
                        <Link
                            href={`/cuisines/${categories[0].slug}`}
                            className="group relative col-span-1 h-80 overflow-hidden rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-lg sm:col-span-2 lg:col-span-8 lg:h-[500px]"
                        >
                            {/* Featured category background */}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 flex items-center justify-center w-full">

                                {categories[0].imageUrl ? (
                                    <div className="relative h-[400px] w-[400px]">
                                        <Image
                                            src={categories[0].imageUrl}
                                            alt={categories[0].name}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 66vw"
                                            priority
                                        />
                                    </div>
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/80" />
                                )}
                            </div>

                            {/* Featured content */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                <span className="mb-2 inline-block rounded-full bg-primary px-3 py-1 text-xs font-medium uppercase">
                                    فئة مميزة
                                </span>
                                <h2 className="mb-2 text-3xl font-bold">{categories[0].name}</h2>
                                {categories[0].description && (
                                    <p className="mb-4 line-clamp-2 max-w-xl text-white/80">
                                        {categories[0].description}
                                    </p>
                                )}
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-primary-foreground/20 backdrop-blur-md border border-primary-foreground/30">
                                        <Icon name="Store" className="h-4 w-4 text-white" />
                                        <span className="text-sm font-bold text-white">{categories[0].restaurantCount}</span>
                                    </div>
                                    <span className="flex items-center font-medium">
                                        تصفح الآن
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mr-1 transition-transform duration-300 group-hover:translate-x-1">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        </Link>
                    )}

                    {/* Normal category grid - shows other categories */}
                    <div className="col-span-1 grid grid-cols-1 gap-6 sm:col-span-2 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-2">
                        {categories.slice(1, 5).map((category: any) => {
                            const hasMultipleActions = [
                                true, // Restaurant count always visible
                                category.hasArticle,
                                category.popularDishesCount > 0
                            ].filter(Boolean).length;

                            return (
                                <div
                                    key={category.id}
                                    className="group flex aspect-square flex-col overflow-hidden rounded-xl border shadow-sm transition-all duration-300 hover:shadow-md"
                                >
                                    <Link
                                        href={`/cuisines/${category.slug}`}
                                        className="relative w-full flex-1 overflow-hidden"
                                    >
                                        {category.imageUrl ? (
                                            <Image
                                                src={category.imageUrl}
                                                alt={category.name}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105 p-2"
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 25vw, 16vw"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900" />
                                        )}

                                        {/* Restaurant count badge */}
                                        <div className="absolute right-2 top-2">
                                            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-br from-primary/95 to-primary/85 backdrop-blur-md border border-primary-foreground/20 shadow-lg">
                                                <div className="flex items-center justify-center w-6 h-6 rounded-md bg-primary-foreground/20">
                                                    <Icon name="Store" className="h-3.5 w-3.5 text-primary-foreground" />
                                                </div>
                                                <span className="text-xs font-bold text-primary-foreground">
                                                    {category.restaurantCount}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>

                                    <div className="bg-card p-3">
                                        <h3 className="font-bold">{category.name}</h3>
                                    </div>

                                    {/* Action Buttons Section */}
                                    {hasMultipleActions > 1 && (
                                        <div className="p-2.5 flex items-center justify-center gap-2 bg-gradient-to-r from-muted/40 via-muted/30 to-muted/40 backdrop-blur-sm border-t border-border/40">
                                            {/* Article Icon Button */}
                                            {category.hasArticle && (
                                                <Link
                                                    href={`/cuisine/${category.slug}/article`}
                                                    className="flex-1"
                                                    aria-label={`قراءة مقالة عن ${category.name}`}
                                                >
                                                    <div className="w-full min-h-[44px] flex items-center justify-center rounded-xl bg-gradient-to-br from-accent/15 to-accent/5 hover:from-accent/25 hover:to-accent/10 border border-accent/40 hover:border-accent/60 transition-all duration-300 group/btn shadow-sm hover:shadow-md">
                                                        <Icon name="BookOpen" className="h-5 w-5 text-accent-foreground transition-transform duration-300 group-hover/btn:scale-125" />
                                                    </div>
                                                </Link>
                                            )}

                                            {/* Popular Dishes Icon Button with Counter */}
                                            {category.popularDishesCount > 0 && (
                                                <Link
                                                    href={`/cuisine/${category.slug}/popular-dishes`}
                                                    className="flex-1"
                                                    aria-label={`عرض ${category.popularDishesCount} أطباق مشهورة من ${category.name}`}
                                                >
                                                    <div className="relative w-full min-h-[44px] flex items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 hover:from-primary/25 hover:to-primary/10 border border-primary/40 hover:border-primary/60 transition-all duration-300 group/btn shadow-sm hover:shadow-md">
                                                        <Icon name="UtensilsCrossed" className="h-5 w-5 text-primary transition-transform duration-300 group-hover/btn:scale-125" />
                                                        {/* Counter Badge - Inside button */}
                                                        <span className="absolute top-1 right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-primary text-primary-foreground text-[9px] font-bold shadow-sm">
                                                            {category.popularDishesCount}
                                                        </span>
                                                    </div>
                                                </Link>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Rest of the categories */}
                {categories.length > 5 && (
                    <>
                        <h2 className="mb-6 mt-12 text-2xl font-bold">فئات إضافية</h2>
                        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                            {categories.slice(5).map((category: any) => {
                                const hasMultipleActions = [
                                    true, // Restaurant count always visible
                                    category.hasArticle,
                                    category.popularDishesCount > 0
                                ].filter(Boolean).length;

                                return (
                                    <div
                                        key={category.id}
                                        className="group flex flex-col overflow-hidden rounded-xl border shadow-sm transition-all duration-300 hover:shadow-md"
                                    >
                                        <Link
                                            href={`/cuisines/${category.slug}`}
                                            className="relative aspect-square overflow-hidden block"
                                        >
                                            {category.imageUrl ? (
                                                <Image
                                                    src={category.imageUrl}
                                                    alt={category.name}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900" />
                                            )}

                                            {/* Restaurant count badge */}
                                            <div className="absolute right-2 top-2">
                                                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-br from-primary/95 to-primary/85 backdrop-blur-md border border-primary-foreground/20 shadow-lg">
                                                    <div className="flex items-center justify-center w-6 h-6 rounded-md bg-primary-foreground/20">
                                                        <Icon name="Store" className="h-3.5 w-3.5 text-primary-foreground" />
                                                    </div>
                                                    <span className="text-xs font-bold text-primary-foreground">
                                                        {category.restaurantCount}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>

                                        <div className="bg-card p-3">
                                            <h3 className="font-medium">{category.name}</h3>
                                        </div>

                                        {/* Action Buttons Section */}
                                        {hasMultipleActions > 1 && (
                                            <div className="p-2.5 flex items-center justify-center gap-2 bg-gradient-to-r from-muted/40 via-muted/30 to-muted/40 backdrop-blur-sm border-t border-border/40">
                                                {/* Article Icon Button */}
                                                {category.hasArticle && (
                                                    <Link
                                                        href={`/cuisine/${category.slug}/article`}
                                                        className="flex-1"
                                                        aria-label={`قراءة مقالة عن ${category.name}`}
                                                    >
                                                        <div className="w-full min-h-[44px] flex items-center justify-center rounded-xl bg-gradient-to-br from-accent/15 to-accent/5 hover:from-accent/25 hover:to-accent/10 border border-accent/40 hover:border-accent/60 transition-all duration-300 group/btn shadow-sm hover:shadow-md">
                                                            <Icon name="BookOpen" className="h-5 w-5 text-accent-foreground transition-transform duration-300 group-hover/btn:scale-125" />
                                                        </div>
                                                    </Link>
                                                )}

                                                {/* Popular Dishes Icon Button with Counter */}
                                                {category.popularDishesCount > 0 && (
                                                    <Link
                                                        href={`/cuisine/${category.slug}/popular-dishes`}
                                                        className="flex-1"
                                                        aria-label={`عرض ${category.popularDishesCount} أطباق مشهورة من ${category.name}`}
                                                    >
                                                        <div className="relative w-full min-h-[44px] flex items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 hover:from-primary/25 hover:to-primary/10 border border-primary/40 hover:border-primary/60 transition-all duration-300 group/btn shadow-sm hover:shadow-md">
                                                            <Icon name="UtensilsCrossed" className="h-5 w-5 text-primary transition-transform duration-300 group-hover/btn:scale-125" />
                                                            {/* Counter Badge - Inside button */}
                                                            <span className="absolute top-1 right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-primary text-primary-foreground text-[9px] font-bold shadow-sm">
                                                                {category.popularDishesCount}
                                                            </span>
                                                        </div>
                                                    </Link>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}