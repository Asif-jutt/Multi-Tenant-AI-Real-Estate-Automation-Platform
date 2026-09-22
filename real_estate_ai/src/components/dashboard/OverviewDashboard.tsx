'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../ui/StatCard';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import {
  Users,
  Flame,
  MessageSquare,
  Calendar,
  Sparkles,
  Clock,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Plus,
  ArrowRight,
  TrendingUp,
  FileSpreadsheet,
  Zap,
  Filter,
  Bot
} from 'lucide-react';
import Link from 'next/link';
import { OnboardingChecklist } from '../onboarding/OnboardingChecklist';

export const OverviewDashboard: React.FC = () => {
  const { user, organization, leads, conversations, appointments, approvals, addToast } = useApp();
  const [dateRange, setDateRange] = useState('This Week');
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);

  // Modal form states
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadPhone, setNewLeadPhone] = useState('');
  const [newLeadIntent, setNewLeadIntent] = useState('');
  const [newLeadBudget, setNewLeadBudget] = useState('25000000');

  const pendingApprovalsCount = approvals.filter((a) => a.status === 'pending').length;

  const handleCreateLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addToast({
      type: 'success',
      title: 'Lead Added Successfully',
      message: `${newLeadName} was added to the active pipeline.`
    });
    setIsAddLeadModalOpen(false);
    setNewLeadName('');
    setNewLeadPhone('');
    setNewLeadIntent('');
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Good morning, {user.name.split(' ')[0]} 👋
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {organization.name} • Agency AI Performance Overview
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Date range selector */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-transparent outline-none cursor-pointer"
            >
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
              <option>Last 30 Days</option>
            </select>
          </div>

          <Link
            href="/assistant"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask EstateFlow AI</span>
          </Link>

          <button
            onClick={() => setIsAddLeadModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 text-xs font-bold shadow transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* Agency Setup Onboarding Checklist */}
      <OnboardingChecklist />

      {/* 8 Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="New Leads"
          value="48"
          change="+18.4%"
          trend="up"
          linkUrl="/leads"
          linkLabel="View all leads"
          icon={<Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
          sparklineData={[14, 18, 22, 19, 32, 40, 48]}
        />
        <StatCard
          title="Hot Leads"
          value="14"
          change="+8.2%"
          trend="up"
          linkUrl="/leads?temperature=hot"
          linkLabel="View hot leads"
          icon={<Flame className="w-5 h-5 text-rose-500" />}
          sparklineData={[5, 7, 8, 10, 11, 12, 14]}
          badgeText="High Intent"
        />
        <StatCard
          title="Open Conversations"
          value="29"
          change="-4.1%"
          trend="down"
          linkUrl="/conversations"
          linkLabel="Open inbox"
          icon={<MessageSquare className="w-5 h-5 text-sky-500" />}
          sparklineData={[35, 32, 38, 30, 31, 29, 29]}
        />
        <StatCard
          title="Appointments This Week"
          value="12"
          change="+25.0%"
          trend="up"
          linkUrl="/appointments"
          linkLabel="View calendar"
          icon={<Calendar className="w-5 h-5 text-emerald-500" />}
          sparklineData={[4, 6, 8, 7, 9, 10, 12]}
        />
        <StatCard
          title="AI-Resolved Inquiries"
          value="84.2%"
          change="+5.1%"
          trend="up"
          linkUrl="/analytics"
          linkLabel="AI metrics"
          icon={<Bot className="w-5 h-5 text-purple-500" />}
          sparklineData={[72, 75, 78, 80, 82, 83, 84]}
          badgeText="Verified RAG"
        />
        <StatCard
          title="Avg First-Response Time"
          value="1.8m"
          change="-42.0%"
          trend="up"
          linkUrl="/analytics"
          linkLabel="Response stats"
          icon={<Clock className="w-5 h-5 text-indigo-500" />}
          sparklineData={[8, 6, 4, 3, 2.5, 2.0, 1.8]}
        />
        <StatCard
          title="Pending Approvals"
          value={pendingApprovalsCount}
          change={pendingApprovalsCount > 0 ? "Requires Review" : "All Clear"}
          trend={pendingApprovalsCount > 0 ? "down" : "neutral"}
          linkUrl="/approvals"
          linkLabel="Review queue"
          icon={<ShieldAlert className="w-5 h-5 text-amber-500" />}
          sparklineData={[3, 4, 2, 5, 4, 3, pendingApprovalsCount]}
        />
        <StatCard
          title="Follow-ups Due Today"
          value="6"
          change="SLA On Track"
          trend="neutral"
          linkUrl="/leads"
          linkLabel="View tasks"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />}
          sparklineData={[10, 8, 9, 7, 6, 7, 6]}
        />
      </div>

      {/* Main Grid: Needs Attention Panel & Lead Conversion Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* A. Lead Conversion Funnel */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                Lead Conversion Funnel
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Current agency pipeline stage breakdown</p>
            </div>
            <Link href="/leads" className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline">
              Manage Pipeline &rarr;
            </Link>
          </div>

          {/* Funnel Visual Steps */}
          <div className="space-y-2.5 pt-2">
            {[
              { stage: 'New Leads', count: 48, pct: '100%', color: 'bg-purple-600' },
              { stage: 'AI Contacted', count: 42, pct: '87.5%', color: 'bg-indigo-600' },
              { stage: 'Qualified Intent', count: 31, pct: '64.5%', color: 'bg-sky-600' },
              { stage: 'Viewing Scheduled', count: 18, pct: '37.5%', color: 'bg-emerald-600' },
              { stage: 'In Negotiation', count: 8, pct: '16.6%', color: 'bg-amber-600' },
              { stage: 'Deals Won', count: 5, pct: '10.4%', color: 'bg-emerald-500' }
            ].map((f, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">{f.stage}</span>
                  <span className="text-slate-900 dark:text-slate-100 font-bold">{f.count} ({f.pct})</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className={`h-full rounded-full ${f.color} transition-all duration-500`} style={{ width: f.pct }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* B. Needs Attention Panel */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Needs Attention ({pendingApprovalsCount + 2})
            </h3>
            <Badge variant="warning">High Priority</Badge>
          </div>

          <div className="space-y-3 text-xs">
            {/* Action 1: Pending Approval */}
            {pendingApprovalsCount > 0 && (
              <div className="p-3.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="font-bold text-amber-900 dark:text-amber-200">AI Action Requires Approval</div>
                  <p className="text-slate-600 dark:text-slate-400">Appointment viewing booking for Muhammad Bilal Khan (Gulberg III 3-Bed).</p>
                </div>
                <Link href="/approvals" className="px-2.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold shrink-0">
                  Review
                </Link>
              </div>
            )}

            {/* Action 2: Human handoff waiting */}
            <div className="p-3.5 rounded-xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="font-bold text-rose-900 dark:text-rose-200">Customer Waiting for Human Agent</div>
                <p className="text-slate-600 dark:text-slate-400">Dr. Sarah Farooq asked custom 3-month payment terms for DHA Phase 6 House.</p>
              </div>
              <Link href="/conversations" className="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold shrink-0">
                Take Over
              </Link>
            </div>

            {/* Action 3: SLA Countdown Alert */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="font-bold text-slate-900 dark:text-slate-100">SLA Follow-up Expiring Soon</div>
                <p className="text-slate-500 dark:text-slate-400">Mrs. Shabana Yasmeen Bahria Town negotiation token agreement due in 10 mins.</p>
              </div>
              <Badge variant="danger">10m left</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Recent Conversations & Upcoming Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* C. Recent Conversations */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-sky-500" />
              Active Conversations
            </h3>
            <Link href="/conversations" className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline">
              View Omnichannel Inbox &rarr;
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {conversations.map((c) => (
              <div key={c.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold flex items-center justify-center text-xs shrink-0">
                    {c.customerName.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{c.customerName}</h4>
                      <Badge variant={c.channel === 'whatsapp' ? 'success' : 'info'}>{c.channel}</Badge>
                      {c.requiresApproval && <Badge variant="warning">Needs Approval</Badge>}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{c.lastMessage}</p>
                  </div>
                </div>

                <div className="text-right shrink-0 text-xs">
                  <div className="font-semibold text-slate-900 dark:text-slate-100">{c.lastMessageTime}</div>
                  <div className="text-[10px] text-slate-400">Agent: {c.assignedAgent.split(' ')[0]}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* D. Upcoming Appointments */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-500" />
              Upcoming Viewing Schedule
            </h3>
            <Link href="/appointments" className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline">
              Calendar &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {appointments.map((app) => (
              <div key={app.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-slate-100">{app.customerName}</span>
                  <Badge variant={app.status === 'confirmed' ? 'success' : 'warning'}>{app.status.replace('_', ' ')}</Badge>
                </div>
                <div className="text-slate-600 dark:text-slate-300 font-medium">{app.propertyTitle}</div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                  <span>📅 {app.date} at {app.time}</span>
                  <span>Agent: {app.agentName}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* E. Quick Actions Panel */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" /> Quick Operations
          </h3>
          <span className="text-xs text-slate-400">Shortcuts for agency staff</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs font-semibold">
          <Link href="/properties" className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 flex items-center gap-2 transition-colors">
            <Plus className="w-4 h-4 text-purple-400" /> Add Property
          </Link>
          <Link href="/documents" className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 flex items-center gap-2 transition-colors">
            <FileSpreadsheet className="w-4 h-4 text-sky-400" /> Import Listings
          </Link>
          <button onClick={() => setIsAddLeadModalOpen(true)} className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 flex items-center gap-2 transition-colors text-left">
            <Users className="w-4 h-4 text-emerald-400" /> Add Lead
          </button>
          <Link href="/approvals" className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 flex items-center gap-2 transition-colors">
            <ShieldAlert className="w-4 h-4 text-amber-400" /> Review Approvals
          </Link>
          <Link href="/automations" className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 flex items-center gap-2 transition-colors">
            <Zap className="w-4 h-4 text-purple-400" /> Create Automation
          </Link>
        </div>
      </div>

      {/* Modal: Add Lead */}
      <Modal isOpen={isAddLeadModalOpen} onClose={() => setIsAddLeadModalOpen(false)} title="Add New Agency Lead">
        <form onSubmit={handleCreateLeadSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Customer Full Name</label>
            <input
              type="text"
              value={newLeadName}
              onChange={(e) => setNewLeadName(e.target.value)}
              placeholder="e.g. Hassan Raza"
              className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Pakistani Phone Number</label>
            <input
              type="text"
              value={newLeadPhone}
              onChange={(e) => setNewLeadPhone(e.target.value)}
              placeholder="+92 300 1234567"
              className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Property Requirement Intent</label>
            <input
              type="text"
              value={newLeadIntent}
              onChange={(e) => setNewLeadIntent(e.target.value)}
              placeholder="e.g. 3-Bed Apartment in Johar Town"
              className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Max Budget (PKR)</label>
            <input
              type="number"
              value={newLeadBudget}
              onChange={(e) => setNewLeadBudget(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddLeadModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow">
              Create Lead
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
