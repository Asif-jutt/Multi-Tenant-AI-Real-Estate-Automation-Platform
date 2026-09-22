'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { Lead } from '../../types';
import {
  Users,
  Search,
  Filter,
  Flame,
  Clock,
  UserCheck,
  Building,
  Plus,
  FileSpreadsheet,
  Calendar,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Send,
  X
} from 'lucide-react';

export const LeadsModule: React.FC = () => {
  const { leads, properties, addToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTemp, setFilterTemp] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(leads[0] || null);

  const filteredLeads = leads.filter((l) => {
    if (filterTemp !== 'all' && l.temperature !== filterTemp) return false;
    if (filterStatus !== 'all' && l.status !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        l.name.toLowerCase().includes(q) ||
        l.phone.includes(q) ||
        l.intent.toLowerCase().includes(q) ||
        l.preferredLocation.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            Lead Management Pipeline
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time lead score breakdown, AI qualification, SLA countdowns & agent assignments
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50">
            <FileSpreadsheet className="w-3.5 h-3.5" /> Export CSV
          </button>
          <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow">
            <Plus className="w-4 h-4" /> Add Lead
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter leads by name, phone, intent, location..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          <div className="flex items-center gap-1">
            <span className="text-slate-500 font-medium">Temperature:</span>
            <select
              value={filterTemp}
              onChange={(e) => setFilterTemp(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 outline-none font-semibold cursor-pointer"
            >
              <option value="all">All ({leads.length})</option>
              <option value="hot">Hot 🔥</option>
              <option value="warm">Warm</option>
              <option value="cold">Cold</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-slate-500 font-medium">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 outline-none font-semibold cursor-pointer"
            >
              <option value="all">All Stages</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="viewing_scheduled">Viewing Scheduled</option>
              <option value="negotiation">Negotiation</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Lead Table (Left) & Lead Deep-Dive Detail Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Table Column */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Lead Registry ({filteredLeads.length})
            </h3>
            <span className="text-xs text-slate-400">Click lead to open intelligence detail</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3">Client & Score</th>
                  <th className="p-3">Intent & Location</th>
                  <th className="p-3">Budget (PKR)</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Agent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredLeads.map((lead) => {
                  const isSelected = selectedLead?.id === lead.id;
                  return (
                    <tr
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-purple-50/70 dark:bg-purple-950/40 border-l-4 border-purple-600'
                          : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <td className="p-3 space-y-1">
                        <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                          {lead.name}
                          {lead.temperature === 'hot' && <Flame className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                            Score {lead.score}/100
                          </span>
                          <span className="text-[10px] text-slate-400">{lead.source}</span>
                        </div>
                      </td>

                      <td className="p-3 space-y-0.5">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">{lead.intent}</div>
                        <div className="text-[11px] text-slate-500">{lead.preferredLocation}, {lead.city}</div>
                      </td>

                      <td className="p-3 font-bold text-slate-900 dark:text-slate-100">
                        PKR {(lead.budget / 1000000).toFixed(1)}M
                      </td>

                      <td className="p-3">
                        <Badge
                          variant={
                            lead.status === 'viewing_scheduled'
                              ? 'success'
                              : lead.status === 'negotiation'
                              ? 'warning'
                              : 'primary'
                          }
                        >
                          {lead.status.replace('_', ' ')}
                        </Badge>
                      </td>

                      <td className="p-3 text-slate-600 dark:text-slate-400 font-medium">
                        {lead.assignedAgent.split(' ')[0]}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Lead Intelligence & Score Breakdown Detail Panel */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-6">
          {selectedLead ? (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-slate-900 dark:text-slate-100">{selectedLead.name}</h2>
                    <Badge variant={selectedLead.temperature === 'hot' ? 'danger' : 'warning'}>
                      {selectedLead.temperature.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {selectedLead.phone} • {selectedLead.email}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-black text-purple-600 dark:text-purple-400">{selectedLead.score}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">AI Score</div>
                </div>
              </div>

              {/* SLA Countdown Warning */}
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-semibold">
                  <Clock className="w-4 h-4 text-amber-600" />
                  SLA Response Countdown:
                </div>
                <span className="font-bold text-amber-700 dark:text-amber-300 font-mono">
                  {selectedLead.slaCountdownMinutes} mins left
                </span>
              </div>

              {/* AI Score Factor Breakdown (CRITICAL TRUST REQUIREMENT: Never display unexplained score) */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" /> Score Explanation & Factor Breakdown
                </h4>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                  {selectedLead.scoreBreakdown.map((f, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{f.label}</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">+{f.points} pts</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between font-bold text-slate-900 dark:text-slate-100">
                    <span>Total Calculated Lead Score:</span>
                    <span className="text-purple-600 dark:text-purple-400">{selectedLead.score} / 100</span>
                  </div>
                </div>
              </div>

              {/* AI Summary */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">AI Qualification Summary</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-purple-50/60 dark:bg-purple-950/40 p-3 rounded-xl border border-purple-200/60 dark:border-purple-800/60">
                  {selectedLead.aiSummary}
                </p>
              </div>

              {/* Matched Properties */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Matched Inventory Properties</h4>
                <div className="space-y-2">
                  {selectedLead.matchedPropertyIds.map((propId) => {
                    const prop = properties.find((p) => p.id === propId);
                    if (!prop) return null;
                    return (
                      <div key={prop.id} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-slate-900 dark:text-slate-100">{prop.title}</div>
                          <div className="text-slate-500">{prop.location} • PKR {(prop.price / 1000000).toFixed(1)}M</div>
                        </div>
                        <Badge variant="success">Verified Match</Badge>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Primary Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() =>
                    addToast({
                      type: 'success',
                      title: 'Viewing Scheduled',
                      message: `Viewing appointment invitation sent to ${selectedLead.name}.`
                    })
                  }
                  className="py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow"
                >
                  Schedule Viewing
                </button>
                <button
                  onClick={() =>
                    addToast({
                      type: 'info',
                      title: 'Message Sent',
                      message: `WhatsApp brochure sent to ${selectedLead.phone}.`
                    })
                  }
                  className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
                >
                  Send WhatsApp
                </button>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400">Select a lead to view intelligence</div>
          )}
        </div>
      </div>
    </div>
  );
};
