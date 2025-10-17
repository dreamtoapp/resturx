// components/ShiftSelector.tsx
'use client';
import {
  useEffect,
  useState,
} from 'react';
import { Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { getAvailableShifts } from '../actions/shiftActions';
import { Shift } from '@/types/databaseTypes';

interface ShiftSelectorProps {
  selectedShiftId: string;
  onShiftSelect: (selectedShiftId: string) => void;
}

export const ShiftSelector = ({ selectedShiftId, onShiftSelect }: ShiftSelectorProps) => {
  const [shifts, setShifts] = useState<Partial<Shift>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        setIsLoading(true);
        setError('');
        const shiftsData = await getAvailableShifts();

        if (!shiftsData || shiftsData.length === 0) {
          setError('لا توجد أوقات توصيل متاحة حالياً');
          return;
        }

        setShifts(shiftsData);

        // Auto-select first shift if none selected
        if (shiftsData.length > 0 && !selectedShiftId) {
          onShiftSelect(shiftsData[0].id!);
        }
      } catch (err) {
        console.error('Error fetching shifts:', err);
        setError('فشل تحميل أوقات التوصيل. يرجى المحاولة مرة أخرى');
      } finally {
        setIsLoading(false);
      }
    };

    fetchShifts();
    // We only need to load shifts once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return (
      <Card className="shadow-lg border-0 bg-white">
        <CardContent className="p-4">
          <div className="space-y-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-800">
          <Clock className="h-6 w-6 text-blue-600" />
          وقت التوصيل
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-5 space-y-3">
        <div role="radiogroup" className="flex flex-wrap gap-2 ">
          {shifts.filter(shift => shift.id).map((shift) => {
            const isSelected = selectedShiftId === shift.id;
            const buttonClasses = isSelected
              ? 'border-primary ring-2 ring-primary/20 bg-primary/10 text-foreground'
              : 'border-slate-200 hover:bg-slate-50 text-foreground';
            const iconClasses = isSelected ? 'text-primary' : 'text-muted-foreground';
            return (
              <button
                key={shift.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => onShiftSelect(shift.id!)}
                className={`h-12 w-full sm:w-auto rounded-xl border px-3 sm:px-4 text-right flex items-center justify-between transition-colors flex-shrink-0 ${buttonClasses}`}
              >
                <span className="flex items-center gap-2">
                  <Clock className={`h-4 w-4 ${iconClasses}`} />
                  <span
                    className={`font-medium ${isSelected ? "text-primary" : "text-primary/70"
                      }`}
                  >
                    {shift.startTime} - {shift.endTime}
                  </span>
                </span>
                {isSelected && <CheckCircle className="h-4 w-4 text-primary" />}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
