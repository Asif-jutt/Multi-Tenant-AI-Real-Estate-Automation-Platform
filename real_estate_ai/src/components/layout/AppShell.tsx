'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { PublicNavbar } from './PublicNavbar';
import { GlobalSearchModal } from './GlobalSearchModal';
import { ToastContainer } from '../ui/ToastContainer';
import { InteractiveDemoJourneyModal } from '../demo/InteractiveDemoJourneyModal';
import { AuthModal } from '../auth/AuthModal';
import { useApp } from '../../context/AppContext';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isStaff = user.role !== 'customer' && user.id !== 'guest-001';

  // Public View Mode (Guest / Unauthenticated Visitor)
  if (!isStaff) {
    return (
      <div className="min-h-screen w-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased transition-colors">
        <PublicNavbar />
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 px-4 text-center text-xs text-slate-600 dark:text-slate-400 transition-colors">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <strong className="text-slate-900 dark:text-white">EstateFlow AI</strong> • Multi-Tenant Real Estate Operations Platform
            </div>
            <div className="flex items-center gap-6">
              <span>Verified Agency Network</span>
              <span>•</span>
              <span>PKR Currency Standard</span>
              <span>•</span>
              <span>Supabase Cloud Architecture</span>
            </div>
          </div>
        </footer>

        <GlobalSearchModal />
        <ToastContainer />
        <AuthModal />
      </div>
    );
  }

  // Agency Staff Operations Workspace (Authenticated Staff/Admin)
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Mobile Drawer Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-slate-950/60 backdrop-blur-sm">
          <div className="w-64">
            <Sidebar onCloseMobile={() => setMobileMenuOpen(false)} />
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* Right Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onMobileMenuToggle={() => setMobileMenuOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6">
          {children}
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <GlobalSearchModal />
      <ToastContainer />
      <InteractiveDemoJourneyModal />
      <AuthModal />
    </div>
  );
};
