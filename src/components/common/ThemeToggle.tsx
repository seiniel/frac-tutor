import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fractutor_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('fractutor_theme', theme);
    } catch {
      // ignore storage quota errors
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      title={isDark ? 'Modo Claro' : 'Modo Oscuro'}
      className={`relative inline-flex items-center justify-between p-1.5 w-14 h-8 rounded-full transition-colors duration-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 cursor-pointer ${
        isDark ? 'bg-slate-800 border border-slate-700' : 'bg-slate-200 border border-slate-300'
      } ${className}`}
    >
      <span className="sr-only">{isDark ? 'Activar modo claro' : 'Activar modo oscuro'}</span>
      
      {/* Sun icon on left */}
      <Sun className={`w-3.5 h-3.5 transition-opacity duration-200 ${isDark ? 'opacity-40 text-slate-400' : 'opacity-100 text-amber-500'}`} />
      
      {/* Moon icon on right */}
      <Moon className={`w-3.5 h-3.5 transition-opacity duration-200 ${isDark ? 'opacity-100 text-indigo-400' : 'opacity-40 text-slate-500'}`} />

      {/* Sliding knob */}
      <span
        aria-hidden="true"
        className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white dark:bg-slate-900 shadow-md transform transition-transform duration-300 flex items-center justify-center border border-slate-200 dark:border-slate-700 ${
          isDark ? 'translate-x-6' : 'translate-x-0'
        }`}
      >
        {isDark ? (
          <Moon className="w-3.5 h-3.5 text-indigo-400" />
        ) : (
          <Sun className="w-3.5 h-3.5 text-amber-500" />
        )}
      </span>
    </button>
  );
}
