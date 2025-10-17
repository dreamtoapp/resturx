'use client';

import { useState, useEffect } from 'react';

interface ErrorLog {
  id: string;
  errorId: string;
  message: string;
  stack?: string | null;
  digest?: string | null;
  url?: string | null;
  userAgent?: string | null;
  userId?: string | null;
  user?: {
    id: string;
    name: string;
    email: string;
  } | null;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'NEW' | 'INVESTIGATING' | 'IN_PROGRESS' | 'RESOLVED' | 'IGNORED';
  createdAt: string;
  updatedAt: string;
  resolved: boolean;
}

interface UseSimpleErrorDataReturn {
  errors: ErrorLog[] | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  markAsFixed: (errorId: string) => Promise<void>;
  clearFixed: () => Promise<void>;
  clearAll: () => Promise<void>;
}

export function useSimpleErrorData(): UseSimpleErrorDataReturn {
  const [errors, setErrors] = useState<ErrorLog[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchErrors = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/errors/simple');

      if (!response.ok) {
        throw new Error(`Failed to fetch errors: ${response.statusText}`);
      }

      const data = await response.json();
      setErrors(data.errors);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  const markAsFixed = async (errorId: string): Promise<void> => {
    try {
      const response = await fetch(`/api/errors/${errorId}/fix`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Failed to mark error as fixed');
      }
    } catch (err) {
      console.error('Error marking as fixed:', err);
      throw err;
    }
  };

  const clearFixed = async (): Promise<void> => {
    try {
      const response = await fetch('/api/errors/clear-fixed', {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to clear fixed errors');
      }
    } catch (err) {
      console.error('Error clearing fixed errors:', err);
      throw err;
    }
  };

  const clearAll = async (): Promise<void> => {
    try {
      const response = await fetch('/api/errors/clear-all', {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to clear all errors');
      }
    } catch (err) {
      console.error('Error clearing all errors:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchErrors();
  }, []);

  return {
    errors,
    isLoading,
    error,
    refetch: fetchErrors,
    markAsFixed,
    clearFixed,
    clearAll
  };
}
