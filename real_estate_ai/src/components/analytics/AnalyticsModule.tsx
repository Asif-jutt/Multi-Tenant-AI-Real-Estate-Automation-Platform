'use client';

import React from 'react';
import { Badge } from '../ui/Badge';
import { StatCard } from '../ui/StatCard';
import { BarChart3, TrendingUp, DollarSign, Cpu, Clock, Bot, Download, Calendar } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const AnalyticsModule: React.FC = () => {
  const leadFunnelData = [
    { stage: 'New Leads', count: 48 },
    { stage: 'AI Contacted', count: 42 },
    { stage: 'Qualified Intent', count: 31 },
    { stage: 'Viewing Scheduled', count: 18 },
    { stage: 'Negotiation', count: 8 },
    { stage: 'Won Deals', count: 5 }
  ];

  const responseTimeData = [
    { day: 'Mon', minutes: 5.2 },
    { day: 'Tue', minutes: 3.8 },
    { day: 'Wed', minutes: 2.9 },
    { day: 'Thu', minutes: 2.1 },
    { day: 'Fri', minutes: 1.8 },
    { day: 'Sat', minutes: 1.5 },
    { day: 'Sun', minutes: 1.8 }
  ];

  const channelData = [
    { name: 'WhatsApp Business', value: 65, color: '#10b981' },
    { name: 'Website Form', value: 20, color: '#3b82f6' },
    { name: 'Facebook Ads', value: 10, color: '#8b5cf6' },
    { name: 'Portal Zameen', value: 5, color: '#f59e0b' }
  ];

  const aiVsHumanData = [
    { name: 'AI Resolved', value: 84, color: '#7c3aed' },
    { name: 'Human Handoff', value: 16, color: '#f43f5e' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            Agency Analytics & AI Performance
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Lead conversion funnel, response times, model cost & RAG resolution benchmarks
          </p>
        </div>

        <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow">
          <Download className="w-4 h-4" /> Export Report
        </button>
      </div>

      {/* AI Token & Cost Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Est. Monthly LLM Cost" value="$42.50" change="Within $100 Budget" trend="up" icon={<DollarSign className="w-5 h-5 text-emerald-500" />} />
        <StatCard title="Total Tokens Processed" value="1.28M" change="+14.2%" trend="up" icon={<Cpu className="w-5 h-5 text-purple-500" />} />
        <StatCard title="Avg AI Response Latency" value="840ms" change="-120ms" trend="up" icon={<Clock className="w-5 h-5 text-sky-500" />} />
        <StatCard title="RAG Citation Accuracy" value="99.2%" change="Zero Hallucination" trend="up" icon={<Bot className="w-5 h-5 text-indigo-500" />} />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Lead Funnel Bar Chart */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Lead Conversion Funnel Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leadFunnelData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="stage" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }} />
                <Bar dataKey="count" fill="#7c3aed" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Response Time Trend Area Chart */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Avg First-Response Time Trend (Minutes)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={responseTimeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }} />
                <Area type="monotone" dataKey="minutes" stroke="#10b981" fill="#10b981" fillOpacity={0.2} strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Channel Share Pie Chart */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Lead Volume by Channel Share</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={channelData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {channelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI vs Human Resolution Share */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">AI Resolution vs Human Handoff Share</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={aiVsHumanData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} label>
                  {aiVsHumanData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
