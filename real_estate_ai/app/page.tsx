'use client';

import React, { useState } from 'react';
import { AppShell } from '../src/components/layout/AppShell';
import { OverviewDashboard } from '../src/components/dashboard/OverviewDashboard';
import { PublicMarketplace } from '../src/components/marketplace/PublicMarketplace';
import { useApp } from '../src/context/AppContext';
import { Building2, Globe, LayoutDashboard } from 'lucide-react';

export default function OverviewPage() {
  const { user } = useApp();
  const [activeView, setActiveView] = useState<'marketplace' | 'dashboard'>('marketplace');

  const isAuthenticated = user.role !== 'customer' && user.id !== 'guest-001';

  return (
    <AppShell>
      {/* View Switcher Bar for Authenticated Agency Staff */}
      {isAuthenticated && (
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
          <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-200/80 dark:bg-slate-800 text-xs font-bold">
            <button
              onClick={() => setActiveView('marketplace')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                activeView === 'marketplace'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Public Property Marketplace</span>
            </button>

            <button
              onClick={() => setActiveView('dashboard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                activeView === 'dashboard'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Agency Operations Dashboard</span>
            </button>
          </div>

          <div className="text-xs text-slate-500 font-medium hidden sm:block">
            Signed in to <strong className="text-slate-900 dark:text-slate-200">{user.organizationName}</strong> ({user.role})
          </div>
        </div>
      )}

      {/* Render selected view */}
      {activeView === 'marketplace' || !isAuthenticated ? (
        <PublicMarketplace onSwitchToAgencyDashboard={() => setActiveView('dashboard')} />
      ) : (
        <OverviewDashboard />
      )}
    </AppShell>
  );
}
