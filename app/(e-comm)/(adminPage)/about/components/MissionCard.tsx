import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart } from 'lucide-react';

type MissionCardProps = {
    title: string;
    text: string;
};

const MissionCard = ({ title, text }: MissionCardProps) => (
    <section className='mb-16' aria-labelledby="about-mission-title">
        <Card className="border bg-background rounded-2xl p-6 md:p-8 text-center">
            <CardHeader>
                <CardTitle id="about-mission-title" className="flex items-center justify-center gap-3 text-2xl md:text-3xl">
                    <Heart className="h-8 w-8 text-feature-suppliers" aria-hidden />
                    <span className="font-arabic">{title}</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className='text-base md:text-lg text-muted-foreground max-w-3xl mx-auto font-arabic mt-2 leading-relaxed break-words'>
                    {text}
                </p>
            </CardContent>
        </Card>
    </section>
);

export default MissionCard; 