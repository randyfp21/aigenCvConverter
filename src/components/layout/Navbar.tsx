'use client';

import React from 'react';
import { Sparkles, Sun, Moon, Database, ShieldCheck } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 transition-colors duration-500 backdrop-blur-3xl bg-white/70 dark:bg-slate-950/75 border-b border-slate-200/60 dark:border-slate-800/60 shadow-xl shadow-slate-900/5 dark:shadow-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & iOS 27 Liquid Glass Pill */}
        <div className="flex items-center space-x-3">
          <div className="relative group cursor-pointer">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 rounded-2xl blur-md opacity-60 group-hover:opacity-100 transition duration-500 animate-pulse" />
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-black shadow-lg shadow-blue-500/30">
              <Sparkles className="w-5 h-5 text-sky-200 animate-spin-slow" />
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="font-black text-base sm:text-lg tracking-tight text-slate-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-900 to-slate-800 dark:from-white dark:via-sky-200 dark:to-slate-300">
                AiGen CV Converter
              </span>
              <span className="text-[10px] font-extrabold tracking-widest uppercase px-2 py-0.5 rounded-full bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-sky-300 border border-blue-500/20 shadow-sm backdrop-blur-md">
                iOS 27 Liquid
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
              Corporate Standardized Qualification &amp; Target Template Engine
            </p>
          </div>
        </div>

        {/* Right Actions: PostgreSQL Status Indicator & Light/Dark Theme Switcher */}
        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold backdrop-blur-xl">
            <Database className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span>PostgreSQL Local Sync</span>
          </div>

          {/* Liquid Glass Theme Switcher Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle Light and Dark Theme"
            className="relative group p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900/90 border border-slate-300/80 dark:border-slate-800/80 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-sky-300 transition-all duration-300 shadow-md hover:shadow-xl active:scale-95 flex items-center justify-center backdrop-blur-2xl"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 transition-transform duration-500 group-hover:rotate-90" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600 transition-transform duration-500 group-hover:-rotate-12" />
            )}
            <span className="sr-only">Toggle theme</span>
          </button>
        </div>
      </div>
    </header>
  );
};
