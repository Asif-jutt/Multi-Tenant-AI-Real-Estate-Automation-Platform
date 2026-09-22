'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Home,
  Search,
  FileText,
  Calendar,
  ShieldAlert,
  Zap,
  BarChart3,
  Share2,
  Settings,
  Building2,
  HelpCircle,
  LogOut,
  Sparkles,
  ChevronDown
} from 'lucide-react';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const pathname = usePathname();
  const { organization, user, approvals, logoutUser, setIsAuthModalOpen, setAuthViewTab } = useApp();

  const pendingApprovals = approvals.filter((a) => a.status === 'pending').length;

  const navItems = [
    { label: 'Overview', href: '/', icon: LayoutDashboard },
    { label: 'Leads', href: '/leads', icon: Users, badge: '4' },
    { label: 'Conversations', href: '/conversations', icon: MessageSquare, badge: '2' },
    { label: 'Properties', href: '/properties', icon: Home },
    { label: 'Customer Search', href: '/customer/properties', icon: Search, tag: 'Public View' },
    { label: 'Documents', href: '/documents', icon: FileText },
    { label: 'Appointments', href: '/appointments', icon: Calendar },
    { label: 'Approvals', href: '/approvals', icon: ShieldAlert, highlightBadge: pendingApprovals },
    { label: 'Automations', href: '/automations', icon: Zap },
    { label: 'Analytics', href: '/analytics', icon: BarChart3 },
    { label: 'Integrations', href: '/integrations', icon: Share2 },
    { label: 'Settings', href: '/settings', icon: Settings }
  ];

  return (
    <aside className="w-64 h-screen bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 select-none shrink-0">
      {/* Brand logo & workspace selector */}
      <div className="p-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5 px-2 py-1">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-lg shadow-purple-900/30">
            <Sparkles className="w-5 h-5 fill-white/20" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-white tracking-tight flex items-center gap-1.5">
              EstateFlow <span className="text-purple-400 text-xs px-1.5 py-0.5 rounded bg-purple-950/80 border border-purple-800">AI</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-medium">Multi-Tenant Real Estate Platform</p>
          </div>
        </div>

        {/* Organization switcher card */}
        <div className="mt-3 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between cursor-pointer hover:bg-slate-800 transition-colors">
          <div className="flex items-center gap-2 overflow-hidden">
            <Building2 className="w-4 h-4 text-purple-400 shrink-0" />
            <div className="truncate">
              <div className="text-xs font-semibold text-white truncate">{organization.name}</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Pakistan Agency</div>
            </div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        </div>
      </div>

      {/* Main navigation list */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">Main Modules</div>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${isActive
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40 font-bold'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>

              {item.highlightBadge && item.highlightBadge > 0 ? (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-500 text-slate-950 animate-pulse">
                  {item.highlightBadge}
                </span>
              ) : item.badge ? (
                <span
                  className={`px-1.5 py-0.5 text-[10px] font-semibold rounded-md ${isActive ? 'bg-purple-800 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                >
                  {item.badge}
                </span>
              ) : item.tag ? (
                <span className="px-1.5 py-0.5 text-[9px] font-semibold rounded bg-sky-950 text-sky-400 border border-sky-800">
                  {item.tag}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Bottom User & System Controls */}
      <div className="p-3 border-t border-slate-800/80 space-y-2">
        <Link
          href="/settings"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <HelpCircle className="w-4 h-4 text-slate-500" />
          <span>Help & Documentation</span>
        </Link>

        {/* Current user panel */}
        <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between">
          <div
            onClick={() => {
              setAuthViewTab('login');
              setIsAuthModalOpen(true);
            }}
            className="flex items-center gap-2 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
            title="Click to Switch User Account / Sign In"
          >
            <div className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
              {user.name.charAt(0)}
            </div>
            <div className="truncate">
              <div className="text-xs font-bold text-white truncate">{user.name}</div>
              <div className="text-[10px] text-slate-400 truncate">{user.email}</div>
            </div>
          </div>
          <button
            onClick={logoutUser}
            title="Sign Out / Logout"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
