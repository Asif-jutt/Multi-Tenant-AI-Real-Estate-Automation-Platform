'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { MessageSquare, Sparkles, ShieldAlert, Calendar, CheckCircle2, ArrowRight, RotateCcw } from 'lucide-react';
import Link from 'next/link';

export const InteractiveDemoJourneyModal: React.FC = () => {
  const { isDemoActive, setIsDemoActive, demoStep, runNextDemoStep, resetDemoJourney, approveAction, approvals } = useApp();

  if (!isDemoActive) return null;

  const pendingApproval = approvals.find((a) => a.id === 'appr-301');

  const steps = [
    {
      step: 1,
      title: 'Customer WhatsApp Inquiry',
      desc: 'Muhammad Bilal Khan sends an inquiry in Urdu: "السلام علیکم! مجھے لاہور میں 3 بیڈ روم کا اپارٹمنٹ چاہیے، بجٹ 25 ملین روپے تک ہے۔"',
      channel: 'WhatsApp Business API',
      actionText: 'Execute AI Lead Extraction →'
    },
    {
      step: 2,
      title: 'AI Lead Creation & Intent Extraction',
      desc: 'EstateFlow AI creates Lead #lead-001, parses location (Gulberg III), budget (PKR 25M), bedrooms (3), and language (Urdu).',
      channel: 'NLP Extraction Engine',
      actionText: 'Run RAG Property Search →'
    },
    {
      step: 3,
      title: 'Verified RAG Property Matching',
      desc: 'System searches verified database listings and recommends Property #prop-lah-01 (Gulberg III 3-Bed Luxury Apartment, PKR 24.5M).',
      channel: 'Pinecone Vector DB',
      actionText: 'Customer Requests Viewing →'
    },
    {
      step: 4,
      title: 'Viewing Request & Human Approval Queue',
      desc: 'Customer accepts viewing tomorrow at 11:00 AM. EstateFlow AI places booking in Approvals Queue for agent verification.',
      channel: 'Safety & Trust Protocol',
      actionText: 'Approve AI Action Now'
    },
    {
      step: 5,
      title: 'Calendar Synced & Confirmation Sent!',
      desc: 'Google Calendar appointment event created, agent Zainab Ahmed assigned, and WhatsApp confirmation pin dispatched to customer.',
      channel: 'Google Calendar & WhatsApp API',
      actionText: 'Complete Demo Journey'
    }
  ];

  const currentStepInfo = steps[demoStep - 1];

  const handleStepAction = async () => {
    if (demoStep === 4 && pendingApproval) {
      await approveAction(pendingApproval.id);
    }
    if (demoStep === 5) {
      resetDemoJourney();
    } else {
      runNextDemoStep();
    }
  };

  return (
    <Modal
      isOpen={isDemoActive}
      onClose={() => setIsDemoActive(false)}
      title="⚡ EstateFlow AI — End-to-End Agency Operations Demo"
      subtitle="Follow the live journey from WhatsApp inquiry to AI RAG matching, human approval, and calendar sync."
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Stepper progress bar */}
        <div className="grid grid-cols-5 gap-1.5">
          {steps.map((s) => (
            <div
              key={s.step}
              className={`h-2 rounded-full transition-all ${
                s.step === demoStep
                  ? 'bg-purple-600 animate-pulse'
                  : s.step < demoStep
                  ? 'bg-emerald-500'
                  : 'bg-slate-200 dark:bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Current Active Step Box */}
        <div className="p-5 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 space-y-3">
          <div className="flex items-center justify-between">
            <Badge variant="ai">Step {currentStepInfo.step} of 5</Badge>
            <span className="text-xs font-semibold text-purple-700 dark:text-purple-300">{currentStepInfo.channel}</span>
          </div>

          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{currentStepInfo.title}</h3>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{currentStepInfo.desc}</p>

          {/* Interactive contextual preview box */}
          {demoStep === 1 && (
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 flex items-start gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-emerald-600 dark:text-emerald-400">Incoming WhatsApp Payload</div>
                <div className="italic mt-0.5">"السلام علیکم! مجھے لاہور میں 3 بیڈ روم کا اپارٹمنٹ چاہیے، بجٹ 25 ملین روپے تک ہے۔"</div>
              </div>
            </div>
          )}

          {demoStep === 3 && (
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
              <div className="font-bold text-purple-600 dark:text-purple-400">RAG Vector Result (Score: 0.98)</div>
              <div className="font-semibold text-slate-900 dark:text-slate-100">Modern 3-Bedroom Luxury Apartment — Gulberg III</div>
              <div className="text-slate-500">PKR 24,500,000 • Verified 09:30 AM today</div>
            </div>
          )}

          {demoStep === 4 && (
            <div className="p-3 rounded-xl bg-amber-100/80 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-xs space-y-1">
              <div className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" /> Action Requires Agent Confirmation
              </div>
              <div className="text-slate-800 dark:text-slate-200">Proposed Action: Schedule viewing with Zainab Ahmed for 2026-09-21 at 11:00 AM.</div>
            </div>
          )}

          {demoStep === 5 && (
            <div className="p-3 rounded-xl bg-emerald-100/80 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-xs space-y-1">
              <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Calendar & Lead Sync Success
              </div>
              <div className="text-slate-800 dark:text-slate-200">Google Calendar Event Created & Lead Score updated to 85 (Hot Lead).</div>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={resetDemoJourney}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Flow
          </button>

          <button
            onClick={handleStepAction}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
          >
            <span>{currentStepInfo.actionText}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Modal>
  );
};
