'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { ApprovalItem } from '../../types';
import { ShieldAlert, CheckCircle2, XCircle, Clock, AlertTriangle, Eye, Edit3, ArrowRight } from 'lucide-react';

export const ApprovalsModule: React.FC = () => {
  const { approvals, approveAction, rejectAction, addToast } = useApp();
  const [selectedItem, setSelectedItem] = useState<ApprovalItem | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-amber-500" />
            AI Safety & Action Approval Queue
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Review sensitive AI actions (WhatsApp messages, appointment bookings, price terms) before execution
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="warning">{approvals.filter((a) => a.status === 'pending').length} Pending Approvals</Badge>
        </div>
      </div>

      {/* Approval Cards List */}
      <div className="space-y-4">
        {approvals.map((item) => (
          <div
            key={item.id}
            className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border transition-all shadow-sm space-y-4 ${
              item.status === 'pending'
                ? 'border-amber-300 dark:border-amber-800/80 bg-amber-50/30 dark:bg-amber-950/20'
                : 'border-slate-200 dark:border-slate-800 opacity-70'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Badge variant={item.riskLevel === 'high' ? 'danger' : 'warning'}>
                  {item.riskLevel.toUpperCase()} RISK
                </Badge>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Action: {item.actionType.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">Created: {item.createdTime}</span>
                <Badge variant={item.status === 'pending' ? 'warning' : item.status === 'approved' ? 'success' : 'danger'}>
                  {item.status.toUpperCase()}
                </Badge>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Target Client: {item.customerName}</div>
              <p className="text-xs text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 leading-relaxed font-mono">
                "{item.proposedMessage}"
              </p>
            </div>

            {/* Source Evidence */}
            <div className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl flex items-center justify-between">
              <span><strong>Retrieved Source Evidence:</strong> {item.sourceEvidence}</span>
              <button onClick={() => setSelectedItem(item)} className="font-bold text-purple-600 dark:text-purple-400 hover:underline">
                Inspect Arguments & Payload
              </button>
            </div>

            {/* Approve / Reject Controls */}
            {item.status === 'pending' && (
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => rejectAction(item.id)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-rose-100 text-rose-700 dark:text-rose-300 text-xs font-bold transition-all"
                >
                  <XCircle className="w-4 h-4" /> Reject Action
                </button>
                <button
                  onClick={() => approveAction(item.id)}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" /> Approve & Execute Immediately
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Inspect Arguments Modal */}
      <Modal isOpen={!!selectedItem} onClose={() => setSelectedItem(null)} title="Inspect AI Proposed Arguments & Payload">
        {selectedItem && (
          <div className="space-y-4 text-xs">
            <div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1">Exact Tool Function Name</h4>
              <div className="p-2.5 rounded-xl bg-slate-900 text-purple-300 font-mono text-xs">
                {selectedItem.actionType}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1">Proposed JSON Arguments</h4>
              <pre className="p-3.5 rounded-xl bg-slate-950 text-slate-200 font-mono text-[11px] overflow-x-auto">
                {JSON.stringify(selectedItem.proposedArgs, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
