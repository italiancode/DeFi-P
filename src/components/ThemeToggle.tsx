'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Always render Sun icon on server and during initial mount
  const Icon = mounted && resolvedTheme === 'dark' ? Sun : Moon;

  return (
    <button
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-md hover:bg-accent"
      aria-label="Toggle theme"
      suppressHydrationWarning
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
    </button>
  );
} 