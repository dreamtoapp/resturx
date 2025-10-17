'use client';

import Link from 'next/link';
import { Icon } from '@/components/icons/Icon';
import { useNotificationCounter } from '@/hooks/useNotificationCounter';
import { useEffect } from 'react';
import clsx from 'clsx';
import { useSession } from 'next-auth/react';

interface NotificationBellClientProps {
    initialCount?: number;
    showWarning?: boolean;
    className?: string;
}

export default function NotificationBellClient({
    initialCount = 0,
    showWarning = false,
    className
}: NotificationBellClientProps) {
    const { data: session } = useSession();
    const { unreadCount, refreshCount } = useNotificationCounter(initialCount);

    // Refresh count when component mounts and periodically
    useEffect(() => {
        // ✅ SAFETY CHECK: Only refresh if user is authenticated
        if (!session?.user?.id) {
            console.log('🔒 User not authenticated, skipping notification refresh');
            return;
        }

        // 🚨 PRODUCTION SAFETY: Disable automatic refresh to prevent 404 errors
        // The notification count is already provided by the server via initialCount
        // This prevents unnecessary API calls that could fail in production
        console.log('🔒 Automatic notification refresh disabled for production safety');
        return;

        // Original code commented out for safety
        /*
        // Initial refresh after a short delay
        const timer = setTimeout(refreshCount, 1000);

        // Periodic refresh every 30 seconds
        const interval = setInterval(refreshCount, 30000);

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
        */
    }, [refreshCount, session?.user?.id]);

    // Listen for notification changes from other tabs/windows
    useEffect(() => {
        // 🚨 PRODUCTION SAFETY: Disable storage listener to prevent 404 errors
        // This prevents unnecessary API calls that could fail in production
        console.log('🔒 Storage event listener disabled for production safety');
        return;

        // Original code commented out for safety
        /*
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'notification-update') {
                refreshCount();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
        */
    }, [refreshCount]);

    return (
        <Link
            href="/user/notifications"
            className={clsx(
                'relative flex items-center justify-center w-12 h-12 p-2 rounded-lg transition-all duration-300 hover:scale-105 hover:bg-feature-analytics/20',
                showWarning && 'border border-yellow-400',
                className
            )}
            aria-label="الإشعارات"
            prefetch={false}
        >
            <Icon name="Bell" size="md" className="h-7 w-7 text-foreground" />
            {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-white text-[10px] font-bold shadow ring-1 ring-white dark:ring-gray-900 border border-primary animate-in fade-in zoom-in">
                    {unreadCount}
                </span>
            )}
            {showWarning && (
                <span
                    className="absolute -left-1 -bottom-1 flex h-3 w-3 items-center justify-center rounded-full bg-yellow-400 text-white text-[8px] font-bold shadow border border-yellow-400"
                    title="يتطلب انتباه - الحساب غير مفعل أو العنوان ينقصه إحداثيات"
                >
                    !
                </span>
            )}
        </Link>
    );
} 