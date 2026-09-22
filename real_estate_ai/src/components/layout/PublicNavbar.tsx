'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Globe, Sun, Moon, LogIn, UserPlus, Search, LayoutDashboard, LogOut, Building2 } from 'lucide-react';
import Link from 'next/link';

export const PublicNavbar: React.FC = () => {
  const { language, setLanguage, theme, toggleTheme, setIsAuthModalOpen, setAuthViewTab, setIsSearchOpen, user, logoutUser } = useApp();

  const isGuest = user.id === 'guest-001';
  const isCustomer = user.role === 'customer' && !isGuest;
  const isStaff = !isGuest && !isCustomer;

  return (
    <header className="sticky top-0 z-40 h-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 md:px-8 flex items-center justify-between transition-colors shadow-sm">
      {/* Left: Brand Logo & Title */}
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-lg shadow-purple-900/30 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 fill-white/20" />
          </div>
          <div>
            <div className="text-lg font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              EstateFlow <span className="text-xs px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800 uppercase tracking-widest font-extrabold">Marketplace</span>
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Multi-Agency Verified Real Estate Listings</div>
          </div>
        </Link>
      </div>

      {/* Center Nav Items */}
      <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-700 dark:text-slate-300">
        <Link href="/" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors py-1 border-b-2 border-purple-600 dark:border-purple-500 text-purple-600 dark:text-white font-extrabold">
          All Properties
        </Link>
        {isCustomer && (
          <Link href="/customer/dashboard" className="text-purple-600 dark:text-purple-400 hover:text-purple-700 font-bold transition-colors py-1 flex items-center gap-1.5">
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>My Buyer Dashboard</span>
          </Link>
        )}
        <span className="text-slate-300 dark:text-slate-700">•</span>
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700/60 transition-colors"
        >
          <Search className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          <span>Quick Property Search</span>
        </button>
      </nav>

      {/* Right Controls & Auth Buttons */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Language Switcher */}
        <button
          onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
          title="Switch Language"
        >
          <Globe className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          <span>{language === 'en' ? 'EN' : 'اردو'}</span>
        </button>

        {/* Theme Switcher */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 transition-colors"
          title="Toggle Dark/Light Mode"
        >
          {theme === 'light' ? <Moon className="w-4 h-4 text-slate-700" /> : <Sun className="w-4 h-4 text-amber-400" />}
        </button>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />

        {/* Auth Buttons or Logged-in User Navigation */}
        {isGuest ? (
          <>
            <button
              onClick={() => {
                setAuthViewTab('login');
                setIsAuthModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-900 dark:text-white text-xs font-extrabold border border-slate-300 dark:border-slate-700/80 transition-all shadow-sm"
            >
              <LogIn className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>Sign In</span>
            </button>

            <button
              onClick={() => {
                setAuthViewTab('register');
                setIsAuthModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-extrabold shadow-lg shadow-purple-900/30 transition-all"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Sign Up / Register</span>
            </button>
          </>
        ) : isCustomer ? (
          <div className="flex items-center gap-2">
            <Link
              href="/customer/dashboard"
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-extrabold shadow-md transition-all"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>My Customer Dashboard</span>
            </Link>

            <button
              onClick={() => logoutUser()}
              className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 hover:bg-rose-200 dark:hover:bg-rose-900 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/properties"
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-md transition-all"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Agency Console</span>
            </Link>

            <button
              onClick={() => logoutUser()}
              className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 hover:bg-rose-200 dark:hover:bg-rose-900 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

