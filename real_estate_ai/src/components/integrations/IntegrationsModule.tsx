'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { IntegrationItem } from '../../types';
import { mockIntegrations } from '../../services/mockData';
import { Share2, CheckCircle2, ShieldCheck, RefreshCw, Key, ExternalLink, Power, MessageSquare, Calendar, Database } from 'lucide-react';

export const IntegrationsModule: React.FC = () => {
  const { addToast } = useApp();
  const [integrationsList, setIntegrationsList] = useState<IntegrationItem[]>(mockIntegrations);
  const [selectedInt, setSelectedInt] = useState<IntegrationItem | null>(null);

  const toggleConnect = (id: string) => {
    setIntegrationsList((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const isConn = item.status === 'connected';
          const newStatus = isConn ? 'disconnected' : 'connected';
          addToast({
            type: isConn ? 'warning' : 'success',
            title: isConn ? 'Integration Disconnected' : 'Integration Connected',
            message: `${item.name} status updated to ${newStatus}.`
          });
          return { ...item, status: newStatus as any };
        }
        return item;
      })
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <Share2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            Connected Apps & API Integrations
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Explicit permission scopes for Meta Cloud WhatsApp, Google Workspace, CRM & LLM Vector Databases
          </p>
        </div>
      </div>

      {/* Integration Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrationsList.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant={item.status === 'connected' ? 'success' : 'secondary'}>
                  {item.status.toUpperCase()}
                </Badge>
                <span className="text-xs text-slate-400">{item.category}</span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{item.name}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.description}</p>
              </div>

              {/* Explicit Permission Scopes */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs space-y-1">
                <div className="font-bold text-slate-700 dark:text-slate-300">Explicit Permission Scopes:</div>
                <ul className="text-slate-500 list-disc list-inside space-y-0.5">
                  {item.permissions.map((perm, idx) => (
                    <li key={idx}>{perm}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <button onClick={() => setSelectedInt(item)} className="font-bold text-purple-600 dark:text-purple-400 hover:underline">
                View Scopes & Logs
              </button>

              <button
                onClick={() => toggleConnect(item.id)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  item.status === 'connected'
                    ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 hover:bg-rose-100'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
              >
                {item.status === 'connected' ? 'Disconnect' : 'Connect API'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Permissions & Logs Modal */}
      <Modal isOpen={!!selectedInt} onClose={() => setSelectedInt(null)} title={`Integration Scopes: ${selectedInt?.name}`}>
        {selectedInt && (
          <div className="space-y-4 text-xs">
            <div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1">Declared Authorization Scopes</h4>
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 space-y-1">
                {selectedInt.permissions.map((p, i) => (
                  <div key={i} className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> {p}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  addToast({ type: 'success', title: 'Connection Test Passed', message: `${selectedInt.name} ping response 200 OK.` });
                }}
                className="w-full py-2.5 rounded-xl bg-purple-600 text-white font-bold"
              >
                Run Connection Test Ping
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
