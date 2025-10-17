'use client';

import Carousel, { ArrowProps } from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Image from 'next/image';

// NOTE: Defined locally as the original type source is unavailable.
// For better maintainability, this should be a shared type.
interface Testimonial {
    id: string;
    author?: string;
    imageUrl?: string | null;
    rating: number;
    text: string;
}

const responsive = {
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 3,
    },
    tablet: {
        breakpoint: { max: 1024, min: 640 },
        items: 2,
    },
    mobile: {
        breakpoint: { max: 640, min: 0 },
        items: 1,
    },
};

interface TestimonialSliderProps {
    testimonials: Testimonial[];
}

const CustomArrow = ({ onClick, direction }: ArrowProps & { direction: 'left' | 'right' }) => {
    if (!onClick) {
        return null;
    }

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={onClick}
            className={cn(
                'absolute top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-background/50 hover:bg-background/75 text-foreground transition-all duration-300 ease-in-out backdrop-blur-sm border-border',
                direction === 'left' ? 'left-2 md:-left-4' : 'right-2 md:-right-4'
            )}
            aria-label={direction === 'left' ? 'Previous Testimonial' : 'Next Testimonial'}
        >
            {direction === 'left' ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </Button>
    );
};


const TestimonialSlider = ({ testimonials }: TestimonialSliderProps) => {
    if (!testimonials || testimonials.length === 0) {
        return (
            <div className='text-center py-8'>
                <p className='text-muted-foreground'>لا توجد تقييمات متاحة حالياً</p>
            </div>
        );
    }

    return (
        <div className='relative py-4'>
            <Carousel
                responsive={responsive}
                infinite={true}
                autoPlay={true}
                autoPlaySpeed={4000}
                keyBoardControl={true}
                customTransition="transform 1000ms ease-in-out"
                containerClass="carousel-container"
                itemClass="px-2"
                customLeftArrow={<CustomArrow direction="left" />}
                customRightArrow={<CustomArrow direction="right" />}
                showDots={true}
                dotListClass="custom-dot-list-style"
                removeArrowOnDeviceType={['tablet', 'mobile']}
            >
                {testimonials.map((testimonial, idx) => (
                    <motion.div
                        key={`testimonial-${testimonial.id}`}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1, duration: 0.5, type: 'spring' }}
                    >
                        <Card
                            className="h-full flex flex-col justify-center items-center text-center p-0 min-h-[280px] shadow-lg border border-feature-users/50 card-hover-effect card-border-glow bg-background/90 rounded-xl overflow-hidden"
                        >
                            {/* Full-width image at top */}
                            {testimonial.imageUrl && (
                                <div className="relative w-full h-32 mb-4">
                                    <Image
                                        src={testimonial.imageUrl.includes('unsplash.com') ? `${testimonial.imageUrl}&w=400&q=80` : testimonial.imageUrl}
                                        alt={testimonial.author || 'Client'}
                                        fill
                                        className="object-cover"
                                        loading="lazy"
                                    />
                                </div>
                            )}

                            {/* Content section */}
                            <div className="px-6 pb-6 flex-1 flex flex-col justify-center">
                                <h3 className="text-lg font-semibold font-arabic">{testimonial.author || '?'}</h3>
                                <div className='flex items-center justify-center gap-1 mt-2'>
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-5 w-5 transition-all duration-200 ${i < Math.floor(testimonial.rating) ? 'text-yellow-400 fill-yellow-400 scale-110' : 'text-gray-300'}`}
                                        />
                                    ))}
                                </div>
                                <p className='text-sm text-muted-foreground leading-relaxed mt-4 font-arabic line-clamp-3'>
                                    {testimonial.text}
                                </p>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </Carousel>
        </div>
    );
};

export default TestimonialSlider; 