'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Icon } from '@/components/icons/Icon';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-lg"
        disabled
      >
        <Icon name="Sun" className="h-5 w-5" />
      </Button>
    );
  }

  const currentTheme = resolvedTheme || theme || 'light';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-lg hover:bg-accent transition-colors"
          aria-label="تبديل المظهر"
        >
          {currentTheme === 'dark' ? (
            <Icon name="Moon" className="h-5 w-5 text-muted-foreground" />
          ) : (
            <Icon name="Sun" className="h-5 w-5 text-muted-foreground" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[120px]">
        <DropdownMenuItem
          onClick={() => setTheme('light')}
          className="gap-2 cursor-pointer"
        >
          <Icon name="Sun" className="h-4 w-4" />
          <span>فاتح</span>
          {theme === 'light' && (
            <Icon name="Check" className="h-4 w-4 mr-auto text-primary" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('dark')}
          className="gap-2 cursor-pointer"
        >
          <Icon name="Moon" className="h-4 w-4" />
          <span>داكن</span>
          {theme === 'dark' && (
            <Icon name="Check" className="h-4 w-4 mr-auto text-primary" />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

