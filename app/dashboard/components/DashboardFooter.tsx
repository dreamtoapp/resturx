import Link from 'next/link';
import AppVersion from '../../(e-comm)/homepage/component/AppVersion';

export default function DashboardFooter() {
    return (
        <footer className='border-t bg-background/80 backdrop-blur px-4 md:px-6 py-3 mt-auto'>
            <div className='mx-auto w-full max-w-screen-xl flex flex-wrap items-center justify-center gap-2 text-muted-foreground text-xs md:text-sm'>
                <Link
                    href="https://dreamto.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-foreground transition-colors"
                    title="DreamTo.App - تحويل الأفكار إلى تطبيقات"
                >
                    <span aria-hidden>✨</span>
                    <span className='font-medium'>DreamTo.App</span>
                    <span aria-hidden>🚀</span>
                </Link>
                <span aria-hidden className='opacity-40'>•</span>
                {/* Version */}
                <div className='-my-1'>
                    <AppVersion />
                </div>
                <span aria-hidden className='opacity-40'>•</span>
                {/* Copyright / year */}
                <div className='text-[11px] md:text-xs select-none'>© {new Date().getFullYear()}</div>
            </div>
        </footer>
    );
} 