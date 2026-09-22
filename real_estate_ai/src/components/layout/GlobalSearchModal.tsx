'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, UserCheck, Home, MessageSquare, Calendar, FileText, X } from 'lucide-react';
import Link from 'next/link';

export const GlobalSearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, leads, properties, conversations, appointments } = useApp();
  const [query, setQuery] = useState('');

  if (!isSearchOpen) return null;

  const q = query.toLowerCase().trim();

  const matchedLeads = q ? leads.filter((l) => l.name.toLowerCase().includes(q) || l.intent.toLowerCase().includes(q) || l.phone.includes(q)) : [];
  const matchedProps = q ? properties.filter((p) => p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q) || p.city.toLowerCase().includes(q)) : [];
  const matchedConvs = q ? conversations.filter((c) => c.customerName.toLowerCase().includes(q) || c.lastMessage.toLowerCase().includes(q)) : [];
  const matchedAppts = q ? appointments.filter((a) => a.customerName.toLowerCase().includes(q) || a.propertyTitle.toLowerCase().includes(q)) : [];

  const totalMatches = matchedLeads.length + matchedProps.length + matchedConvs.length + matchedAppts.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Header */}
        <div className="flex items-center gap-3 p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search leads, properties, conversations, appointments, documents..."
            className="flex-1 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 text-base outline-none"
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="px-2.5 py-1 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 bg-slate-200 dark:bg-slate-800 rounded-lg"
          >
            ESC
          </button>
        </div>

        {/* Results area */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          {!query && (
            <div className="py-8 text-center text-slate-400 dark:text-slate-500 text-xs">
              <p className="font-medium text-slate-600 dark:text-slate-400">Type a search term to find records across EstateFlow AI</p>
              <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
                <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-[11px]">e.g. "Muhammad Bilal"</span>
                <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-[11px]">"Gulberg 3 Bed"</span>
                <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-[11px]">"WhatsApp"</span>
              </div>
            </div>
          )}

          {query && totalMatches === 0 && (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400 text-sm">
              <p className="font-semibold">No records found matching "{query}"</p>
              <p className="text-xs text-slate-400 mt-1">Try searching by client name, city (Lahore, Islamabad), or property title.</p>
            </div>
          )}

          {matchedLeads.length > 0 && (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5" /> Leads ({matchedLeads.length})
              </div>
              <div className="space-y-1">
                {matchedLeads.map((lead) => (
                  <Link
                    key={lead.id}
                    href="/leads"
                    onClick={() => setIsSearchOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                  >
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{lead.name}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{lead.intent} • {lead.city} • Score {lead.score}</p>
                    </div>
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                      PKR {(lead.budget / 1000000).toFixed(1)}M
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {matchedProps.length > 0 && (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5" /> Properties ({matchedProps.length})
              </div>
              <div className="space-y-1">
                {matchedProps.map((prop) => (
                  <Link
                    key={prop.id}
                    href="/properties"
                    onClick={() => setIsSearchOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                  >
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{prop.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{prop.location} • {prop.bedrooms} Bed • Verified</p>
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      PKR {(prop.price / 1000000).toFixed(1)}M
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {matchedConvs.length > 0 && (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" /> Conversations ({matchedConvs.length})
              </div>
              <div className="space-y-1">
                {matchedConvs.map((conv) => (
                  <Link
                    key={conv.id}
                    href="/conversations"
                    onClick={() => setIsSearchOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                  >
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{conv.customerName}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{conv.lastMessage}</p>
                    </div>
                    <span className="text-xs text-slate-400">{conv.lastMessageTime}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
