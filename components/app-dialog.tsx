"use client";
import React, {
  memo,
  useMemo,
} from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

interface AppDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  mode?: 'new' | 'update' | 'delete' | 'view' | 'default';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  preventCloseOnBackdrop?: boolean;
}

const AppDialog: React.FC<AppDialogProps> = memo(({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  footer,
  children,
  className = '',
  mode = 'default',
  size = 'md',
  preventCloseOnBackdrop = false,
}) => {
  // Size-based max-width classes
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-[95vw]'
  };

  // Memoize header for performance
  const header = useMemo(() => {
    // Mode-based badge variants
    const modeBadgeVariants = {
      new: 'outline',
      update: 'secondary',
      delete: 'destructive',
      view: 'outline',
      default: 'secondary'
    } as const;

    return (title || description) && (
      <DialogHeader className='space-y-3 pb-4 border-b border-border/50' dir='rtl'>
        <div className='flex items-start justify-between gap-3'>
          <div className='flex-1 min-w-0'>
            {title && (
              <DialogTitle className='text-lg font-semibold text-foreground leading-tight'>
                {title}
              </DialogTitle>
            )}
            {description && (
              <DialogDescription className='text-sm text-muted-foreground mt-1 leading-relaxed'>
                {description}
              </DialogDescription>
            )}
          </div>
          {mode !== 'default' && (
            <Badge
              variant={modeBadgeVariants[mode]}
              className='shrink-0 text-xs px-2 py-1'
            >
              {mode === 'new' ? 'جديد' :
                mode === 'update' ? 'تحديث' :
                  mode === 'delete' ? 'حذف' :
                    mode === 'view' ? 'عرض' : mode}
            </Badge>
          )}
        </div>
      </DialogHeader>
    );
  }, [title, description, mode]);

  // Memoize footer for performance
  const dialogFooter = useMemo(() => (
    footer ? (
      <DialogFooter className='pt-4 border-t border-border/50 bg-muted/20'>
        <div className='flex items-center justify-end gap-2 w-full'>
          {footer}
        </div>
      </DialogFooter>
    ) : null
  ), [footer]);

  // Handle backdrop click prevention
  const handleOpenChange = (newOpen: boolean) => {
    if (preventCloseOnBackdrop && !newOpen && open) {
      return; // Prevent closing on backdrop click
    }
    onOpenChange?.(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        className={cn(
          'max-h-[90vh] overflow-hidden',
          'sm:max-h-[85vh]',
          sizeClasses[size],
          className
        )}
      // Handlers removed to satisfy TS types; backdrop prevention handled via onOpenChange guard
      >
        {/* Header */}
        {header}

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-1 py-2">
          <div className="min-h-0">
            {children}
          </div>
        </div>

        {/* Footer */}
        {dialogFooter}
      </DialogContent>
    </Dialog>
  );
});

AppDialog.displayName = 'AppDialog';

export default AppDialog;
