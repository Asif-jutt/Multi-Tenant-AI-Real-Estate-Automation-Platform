'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { AutomationWorkflow } from '../../types';
import { mockAutomations } from '../../services/mockData';
import { Zap, Play, AlertCircle, CheckCircle2, RefreshCw, ArrowRight, Layers } from 'lucide-react';

export const AutomationsModule: React.FC = () => {
  const { addToast } = useApp();
  const [selectedWorkflow, setSelectedWorkflow] = useState<AutomationWorkflow | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            Agency Automation Workflows
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            n8n / Zapier webhooks, automated WhatsApp lead triggers & step-by-step execution logs
          </p>
        </div>

        <button
          onClick={() => addToast({ type: 'info', title: 'Workflow Builder', message: 'Creating new automation workflow template.' })}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow"
        >
          <Zap className="w-4 h-4" /> Create Workflow
        </button>
      </div>

      {/* Workflows Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockAutomations.map((wf) => (
          <div
            key={wf.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant={wf.status === 'active' ? 'success' : 'danger'}>
                  {wf.status.toUpperCase()}
                </Badge>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{wf.successRate}% Success</span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{wf.name}</h3>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs space-y-1">
                <div className="text-slate-500 font-medium">Trigger: {wf.trigger}</div>
                <div className="text-slate-400">Apps: {wf.appsUsed.join(' • ')}</div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Last run: {wf.lastRun}</span>
              <button onClick={() => setSelectedWorkflow(wf)} className="font-bold text-purple-600 dark:text-purple-400 hover:underline">
                Execution Timeline &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Execution Timeline Modal */}
      <Modal isOpen={!!selectedWorkflow} onClose={() => setSelectedWorkflow(null)} title={`Execution Log: ${selectedWorkflow?.name}`} maxWidth="2xl">
        {selectedWorkflow && (
          <div className="space-y-4 text-xs">
            <div className="space-y-3">
              {selectedWorkflow.executionHistory.map((step, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <CheckCircle2 className={`w-4 h-4 ${step.status === 'success' ? 'text-emerald-500' : 'text-rose-500'}`} />
                      Step {idx + 1}: {step.stepName}
                    </span>
                    <span className="text-[10px] text-slate-400">{step.timestamp}</span>
                  </div>

                  <div className="text-slate-600 dark:text-slate-300 font-mono text-[11px] bg-slate-50 dark:bg-slate-950 p-2 rounded-lg">
                    In: {step.inputSummary}
                  </div>
                  <div className="text-slate-600 dark:text-slate-300 font-mono text-[11px] bg-slate-50 dark:bg-slate-950 p-2 rounded-lg">
                    Out: {step.outputSummary}
                  </div>

                  {step.errorDetails && (
                    <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-800 dark:text-rose-200 font-mono text-[11px]">
                      Error: {step.errorDetails}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
