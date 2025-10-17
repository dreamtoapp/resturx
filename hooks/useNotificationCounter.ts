'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

// 🔔 Client-side notification counter hook
export function useNotificationCounter(initialCount: number = 0) {
  const { data: session } = useSession();
  const [unreadCount, setUnreadCount] = useState(initialCount);

  // Sync with initial server count
  useEffect(() => {
    setUnreadCount(initialCount);
  }, [initialCount]);

  // Functions to update counter
  const incrementCount = useCallback(() => {
    setUnreadCount(prev => prev + 1);
  }, []);

  const decrementCount = useCallback(() => {
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const updateCount = useCallback((newCount: number) => {
    setUnreadCount(Math.max(0, newCount));
  }, []);

  const resetCount = useCallback(() => {
    setUnreadCount(0);
  }, []);

  // Fetch fresh count from server
  const refreshCount = useCallback(async () => {
    // ✅ SAFETY CHECK: Only proceed if user is authenticated
    if (!session?.user?.id) {
      console.log('🔒 User not authenticated, skipping notification count refresh');
      return;
    }

    // 🚨 PRODUCTION SAFETY: Disable automatic refresh to prevent 404 errors
    // The notification count is already provided by the server via initialCount
    // This prevents unnecessary API calls that could fail in production
    console.log('🔒 Automatic notification refresh disabled for production safety');
    return;

    // Original code commented out for safety
    /*
    try {
      console.log('🔄 Refreshing notification count...');
      const response = await fetch('/api/user/notifications/count', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(30000)
      });

      if (!response.ok) {
        console.error('❌ API response not ok:', response.status, response.statusText);
        return;
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('❌ API returned non-JSON response:', contentType);
        return;
      }

      const data = await response.json();
      if (data.success) {
        setUnreadCount(data.count);
        console.log('✅ Notification count updated:', data.count);
      }
    } catch (error) {
      console.error('❌ Failed to refresh notification count:', error);
    }
    */
  }, [session?.user?.id]);

  return {
    unreadCount,
    incrementCount,
    decrementCount,
    updateCount,
    resetCount,
    refreshCount
  };
} 