"use client";
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useRouter } from 'next/navigation';
import AboutTabClient from './AboutTabClient';
import FeaturesTabClient from './FeaturesTabClient';
import FAQTabClient from './FAQTabClient';
import TestimonialsTabClient from './TestimonialsTabClient';
// import { updateAboutPageContent } from '../actions/updateAboutPageContent';
import { updateAboutHero } from '../actions/updateAboutHero';
import MissionTabClient from './MissionTabClient';

export default function AboutAdminClient({ aboutPage }: { aboutPage: any }) {
    const aboutPageId = aboutPage?.id || null;
    const [status, setStatus] = useState<string | undefined>(undefined);
    const [error, setError] = useState<string | undefined>(undefined);
    const router = useRouter();

    async function handleAboutSubmit(values: any) {
        setStatus(undefined);
        setError(undefined);
        try {
            const result = await updateAboutHero({
                heroTitle: values.heroTitle,
                heroSubtitle: values.heroSubtitle,
                heroImageUrl: values.heroImageUrl ?? '',
            });
            if (result.success) {
                setStatus('success');
                // Ensure UI reflects new id immediately (enable image upload overlay to disappear)
                router.refresh();
            } else {
                const err = result.error as any;
                const msg = typeof err === 'string'
                    ? err
                    : (Array.isArray(err?.formErrors) && err.formErrors.length > 0)
                        ? err.formErrors.join(' • ')
                        : (err?.fieldErrors
                            ? Object.values(err.fieldErrors as Record<string, string[]>)
                                .flat()
                                .join(' • ')
                            : '') || 'فشل في الحفظ';
                setError(msg);
            }
        } catch (e: any) {
            setError(e.message || 'Unknown error');
        }
    }

    return (
        <div className="w-full" dir="rtl">
            <div className="mb-6 text-right">
                <h1 className="text-2xl font-bold text-foreground">إدارة محتوى صفحة من نحن</h1>
                <p className="text-muted-foreground mt-2">قم بتحديث محتوى صفحة من نحن وإدارة الأسئلة الشائعة والمميزات</p>
            </div>

            <Tabs defaultValue="about" className="w-full" dir="rtl">
                <TabsList className="mb-6 w-full justify-start" dir="rtl">
                    <TabsTrigger value="about">عن المتجر</TabsTrigger>
                    <TabsTrigger value="mission">رسالتنا</TabsTrigger>
                    <TabsTrigger value="features">لماذا تختارنا</TabsTrigger>
                    <TabsTrigger value="testimonials">آراء العملاء</TabsTrigger>
                    <TabsTrigger value="faq">الأسئلة الشائعة</TabsTrigger>
                </TabsList>

                <TabsContent value="about" className="mt-0" dir="rtl">
                    <AboutTabClient
                        defaultValues={{ ...aboutPage, id: aboutPageId }}
                        onSubmit={handleAboutSubmit}
                        status={status}
                        error={error}
                    />
                </TabsContent>

                <TabsContent value="features" className="mt-0" dir="rtl">
                    <FeaturesTabClient aboutPageId={aboutPageId} />
                </TabsContent>

                <TabsContent value="mission" className="mt-0" dir="rtl">
                    <MissionTabClient aboutPage={aboutPage} />
                </TabsContent>

                <TabsContent value="testimonials" className="mt-0" dir="rtl">
                    <TestimonialsTabClient aboutPageId={aboutPageId} />
                </TabsContent>

                <TabsContent value="faq" className="mt-0" dir="rtl">
                    <FAQTabClient aboutPageId={aboutPageId} />
                </TabsContent>
            </Tabs>
        </div>
    );
} 