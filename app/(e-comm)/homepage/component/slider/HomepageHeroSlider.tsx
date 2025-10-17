'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroSlide {
    id: string;
    header?: string;
    subheader?: string;
    imageUrl: string;
    ctaText: string;
    ctaLink: string;
    discountPercentage?: number;
    isActive: boolean;
}

interface HomepageHeroSliderProps {
    slides: HeroSlide[];
}

const FALLBACK_SLIDES: HeroSlide[] = [
    {
        id: 'hero-1',
        header: 'اكتشف مجموعتنا الحصرية',
        subheader: 'منتجات عالية الجودة بأفضل الأسعار',
        imageUrl: '/fallback/fallback.avif',
        ctaText: 'تسوق الآن',
        ctaLink: '/categories',
        discountPercentage: 50,
        isActive: true,
    },
];

export default function HomepageHeroSlider({ slides }: HomepageHeroSliderProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    const displaySlides = slides && slides.length > 0 ? slides : FALLBACK_SLIDES;

    useEffect(() => {
        if (!isAutoPlaying || displaySlides.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % displaySlides.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [isAutoPlaying, displaySlides.length]);

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
        setIsAutoPlaying(false);
    };

    const currentSlideData = displaySlides[currentSlide];

    return (
        <section className="relative overflow-hidden rounded-2xl shadow-2xl will-change-transform" aria-label="Hero banner">
            <div className="relative min-h-[400px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[700px]">
                <div className="absolute inset-0">
                    <Image
                        src={currentSlideData.imageUrl}
                        alt={'Hero Slide'}
                        fill
                        className={`object-cover transition-all duration-700 ease-in-out ${isImageLoaded ? 'scale-100 opacity-100' : 'scale-105 opacity-0'}`}
                        priority
                        quality={85}
                        sizes="100vw"
                        fetchPriority="high"
                        onLoad={() => setIsImageLoaded(true)}
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    />
                    {/* Simple dark overlay to keep controls readable */}
                    <div className="absolute inset-0 bg-black/20" />
                </div>
                {/* No CTA/hints overlay; keep only navigation controls below */}

                {displaySlides.length > 1 && (
                    <>
                        <button
                            onClick={() => goToSlide((currentSlide - 1 + displaySlides.length) % displaySlides.length)}
                            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 sm:p-3 transition-all duration-300 min-h-[44px] min-w-[44px] flex items-center justify-center"
                            aria-label="الشريحة السابقة"
                        >
                            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </button>

                        <button
                            onClick={() => goToSlide((currentSlide + 1) % displaySlides.length)}
                            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 sm:p-3 transition-all duration-300 min-h-[44px] min-w-[44px] flex items-center justify-center"
                            aria-label="الشريحة التالية"
                        >
                            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </button>

                        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                            {displaySlides.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300 min-h-[32px] min-w-[32px] flex items-center justify-center ${index === currentSlide
                                        ? 'bg-white scale-125'
                                        : 'bg-white/50 hover:bg-white/80'
                                        }`}
                                    aria-label={`الانتقال إلى الشريحة ${index + 1}`}
                                >
                                    <span className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${index === currentSlide ? 'bg-white' : 'bg-transparent'}`} />
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
} 