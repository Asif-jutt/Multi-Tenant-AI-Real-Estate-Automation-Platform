'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../ui/Badge';
import { mockAuditLogs } from '../../services/mockData';
import { Settings, ShieldCheck, Sliders, Lock, Users, Building, Bell, DollarSign, Database, FileText } from 'lucide-react';

export const SettingsModule: React.FC = () => {
  const { user, organization, addToast } = useApp();
  const [activeTab, setActiveTab] = useState<'ai' | 'organization' | 'security' | 'audit'>('ai');

  // AI Threshold states
  const [confidenceThreshold, setConfidenceThreshold] = useState(85);
  const [dailyBudgetUSD, setDailyBudgetUSD] = useState(50);

  const handleSave = () => {
    addToast({
      type: 'success',
      title: 'Settings Saved',
      message: 'AI safety thresholds & agency configuration updated.'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            Agency Platform Settings
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure AI safety thresholds, human handoff triggers, security & compliance audit logs
          </p>
        </div>

        <button onClick={handleSave} className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow">
          Save Changes
        </button>
      </div>

      {/* Tabs bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 text-xs overflow-x-auto pb-1">
        {[
          { id: 'ai', label: 'AI Safety & RAG Thresholds', icon: Sliders },
          { id: 'organization', label: 'Organization & Workspace', icon: Building },
          { id: 'security', label: 'Security & API Keys', icon: Lock },
          { id: 'audit', label: 'Audit History Logs', icon: FileText }
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold transition-all ${
                activeTab === t.id
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: AI SAFETY & THRESHOLDS */}
      {activeTab === 'ai' && (
        <div className="space-y-6 max-w-3xl">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">AI Confidence & Approval Controls</h3>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span>RAG Verification Confidence Threshold:</span>
                  <span className="font-bold text-purple-600 dark:text-purple-400">{confidenceThreshold}%</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="98"
                  value={confidenceThreshold}
                  onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Answers with confidence below {confidenceThreshold}% will automatically trigger human agent review.
                </p>
              </div>

              <div>
                <label className="block font-semibold mb-1">Daily LLM API Budget Cap ($ USD)</label>
                <input
                  type="number"
                  value={dailyBudgetUSD}
                  onChange={(e) => setDailyBudgetUSD(Number(e.target.value))}
                  className="w-full max-w-xs px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">AI Disclosure Notice Text</label>
                <textarea
                  rows={2}
                  defaultValue="EstateFlow AI Assistant for Zameen Choice Real Estate. All property specifications are retrieved from verified database records."
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ORGANIZATION */}
      {activeTab === 'organization' && (
        <div className="space-y-6 max-w-3xl">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Agency Organization Profile</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">Organization Name</label>
                <input type="text" defaultValue={organization.name} className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" />
              </div>
              <div>
                <label className="block font-semibold mb-1">Country</label>
                <input type="text" defaultValue={organization.country} className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SECURITY */}
      {activeTab === 'security' && (
        <div className="space-y-6 max-w-3xl">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Webhook Signing Secrets & API Keys</h3>
            <div className="space-y-2">
              <label className="block font-semibold">Live Production Secret Key</label>
              <input type="password" value="sk_estateflow_pak_live_94829104829104" readOnly className="w-full font-mono px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" />
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 font-bold uppercase text-[10px] text-slate-500 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Actor</th>
                <th className="p-3">Action</th>
                <th className="p-3">Target</th>
                <th className="p-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {mockAuditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="p-3 text-slate-400 font-mono">{log.timestamp}</td>
                  <td className="p-3 font-bold text-slate-900 dark:text-slate-100">{log.actor}</td>
                  <td className="p-3"><Badge variant="ai">{log.action}</Badge></td>
                  <td className="p-3 font-semibold text-purple-600 dark:text-purple-400">{log.target}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
