'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Sparkles, Bell, ShieldAlert, Globe, Sun, Moon, User as UserIcon, Menu, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Header: React.FC<{ onMobileMenuToggle?: () => void }> = ({ onMobileMenuToggle }) => {
  const { user, organization, language, setLanguage, theme, toggleTheme, setIsSearchOpen, approvals, setIsDemoActive, logoutUser, setIsAuthModalOpen, setAuthViewTab } = useApp();
  const pathname = usePathname();

  const pendingApprovalsCount = approvals.filter((a) => a.status === 'pending').length;

  // Format path breadcrumb
  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbText = pathSegments.length > 0 ? pathSegments[0].replace(/-/g, ' ').toUpperCase() : 'OVERVIEW';

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 md:px-6 flex items-center justify-between transition-colors">
      {/* Left side: Mobile menu toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        {onMobileMenuToggle && (
          <button
            onClick={onMobileMenuToggle}
            className="md:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-800 dark:text-slate-200">{organization.name}</span>
          <span>/</span>
          <span className="font-semibold text-purple-600 dark:text-purple-400 tracking-wider">{breadcrumbText}</span>
        </div>
      </div>

      {/* Center / Right controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Global search trigger */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/70 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-500 dark:text-slate-400 text-xs transition-colors"
        >
          <Search className="w-4 h-4 text-slate-400" />
          <span className="hidden md:inline font-medium">Search leads, properties, docs...</span>
          <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-900 rounded border border-slate-300 dark:border-slate-700 text-slate-500">
            Ctrl+K
          </kbd>
        </button>

        {/* Ask EstateFlow AI CTA */}
        <Link
          href="/assistant"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-semibold shadow-sm hover:shadow transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Ask AI</span>
        </Link>

        {/* Interactive Demo Journey Launcher Button */}
        <button
          onClick={() => setIsDemoActive(true)}
          className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-bold hover:bg-amber-100 transition-colors"
        >
          <span>⚡ Launch Live Demo Flow</span>
        </button>

        {/* Pending approvals badge */}
        <Link
          href="/approvals"
          className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Pending Approvals"
        >
          <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          {pendingApprovalsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
              {pendingApprovalsCount}
            </span>
          )}
        </Link>

        {/* Notification bell */}
        <button className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-purple-600 rounded-full"></span>
        </button>

        {/* Language Switcher */}
        <button
          onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Switch Language (English / اردو)"
        >
          <Globe className="w-3.5 h-3.5 text-slate-400" />
          <span>{language === 'en' ? 'EN' : 'اردو'}</span>
        </button>

        {/* Theme Switcher */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Toggle Dark/Light Mode"
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
        </button>

        {/* User Avatar & Auth Controls */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div
            onClick={() => {
              setAuthViewTab('login');
              setIsAuthModalOpen(true);
            }}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            title="Click to Switch Account / Sign In"
          >
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 flex items-center justify-center text-xs font-bold overflow-hidden">
              {user.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" /> : <UserIcon className="w-4 h-4" />}
            </div>
            <div className="hidden xl:block text-left">
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">{user.name}</div>
              <div className="text-[10px] text-slate-500 capitalize">{user.role.replace('_', ' ')}</div>
            </div>
          </div>

          <button
            onClick={logoutUser}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors ml-1"
            title="Sign Out / Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
