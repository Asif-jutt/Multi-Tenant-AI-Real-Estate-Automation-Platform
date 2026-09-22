'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../ui/Badge';
import {
  Sparkles,
  Bot,
  Send,
  Database,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Search,
  Building,
  Users,
  Calendar,
  Zap
} from 'lucide-react';
import Link from 'next/link';

interface StaffAnswerCard {
  question: string;
  verifiedFacts: string[];
  retrievedDocInfo?: string;
  aiSummary: string;
  suggestedAction: string;
  relatedRecordLink?: { label: string; url: string };
}

export const StaffAIAssistant: React.FC = () => {
  const { addToast } = useApp();
  const [prompt, setPrompt] = useState('');
  const [history, setHistory] = useState<StaffAnswerCard[]>([
    {
      question: 'Find three-bedroom apartments in Lahore under PKR 25 million.',
      verifiedFacts: [
        'Property #prop-lah-01: Modern 3-Bedroom Luxury Apartment in Gulberg III (PKR 24.5M PKR, 1850 SqFt). Verified today at 09:30 AM.',
        'Property #prop-lah-03: 10 Marla House in Bahria Town Sector C (PKR 36.0M PKR) - Exceeds budget limit by 11.0M PKR.'
      ],
      retrievedDocInfo: 'Brochure PDF "Gulberg_Luxury_Apartments_Brochure_2026.pdf" confirms 24/7 full generator backup & 2 covered basement parking slots.',
      aiSummary: 'There is 1 exact verified match in Gulberg III meeting all customer criteria under PKR 25 Million. Property is ready for immediate viewing schedule.',
      suggestedAction: 'Send property brochure link to Lead #lead-001 (Muhammad Bilal Khan) via WhatsApp.',
      relatedRecordLink: { label: 'View Property Listing', url: '/properties' }
    }
  ]);

  const suggestedPrompts = [
    'Which hot leads have not been contacted today?',
    'Find three-bedroom apartments in Lahore under PKR 25 million.',
    'Show properties with a price reduction this week.',
    'Which appointments need confirmation?',
    'Why did yesterday’s automation fail?'
  ];

  const handleSend = (textToSend?: string) => {
    const q = textToSend || prompt;
    if (!q.trim()) return;

    let newAnswer: StaffAnswerCard;

    if (q.includes('hot leads') || q.includes('contacted')) {
      newAnswer = {
        question: q,
        verifiedFacts: [
          'Lead #lead-001 (Muhammad Bilal Khan) - Score 85 (Hot). WhatsApp inquiry at 10:02 AM today.',
          'Lead #lead-004 (Mrs. Shabana Yasmeen) - Score 92 (Hot). Cash buyer negotiation in progress.'
        ],
        aiSummary: 'All 2 hot leads have active engagement today. Lead #lead-001 has a pending viewing booking in Approvals Queue.',
        suggestedAction: 'Approve Viewing Booking for Muhammad Bilal Khan in Approvals Queue.',
        relatedRecordLink: { label: 'Go to Approvals Queue', url: '/approvals' }
      };
    } else if (q.includes('automation') || q.includes('fail')) {
      newAnswer = {
        question: q,
        verifiedFacts: [
          'Workflow #wf-03 "Stale Property Data Availability Re-Verification Cron" failed yesterday at 08:00 AM.',
          'Error Code: 504 Gateway Timeout from Zameen portal bridge API.'
        ],
        retrievedDocInfo: 'System audit logs indicate external portal API endpoint timed out after 30,000ms execution.',
        aiSummary: 'The failure was caused by external portal bridge downtime, not internal workflow logic.',
        suggestedAction: 'Click "Retry Workflow" in Automations module or verify portal credentials.',
        relatedRecordLink: { label: 'Inspect Automations Log', url: '/automations' }
      };
    } else if (q.includes('appointments') || q.includes('confirmation')) {
      newAnswer = {
        question: q,
        verifiedFacts: [
          'Appointment #app-101 (Muhammad Bilal Khan, Gulberg III) - Pending Agent Approval for 2026-09-21 11:00 AM.',
          'Appointment #app-102 (Dr. Sarah Farooq, DHA Phase 6) - Confirmed for 2026-09-21 04:00 PM.'
        ],
        aiSummary: '1 appointment requires manual confirmation by agent Zainab Ahmed before sending final WhatsApp location pin.',
        suggestedAction: 'Confirm Appointment #app-101.',
        relatedRecordLink: { label: 'Open Appointments Calendar', url: '/appointments' }
      };
    } else {
      newAnswer = {
        question: q,
        verifiedFacts: [
          'Queried database inventory (5 verified properties across Lahore, Islamabad, Karachi).',
          'Checked active pipeline (4 leads in various stages).'
        ],
        aiSummary: `Processed staff request "${q}". All retrieved records are validated against agency database.`,
        suggestedAction: 'Create task for assigned agent or schedule follow-up.',
        relatedRecordLink: { label: 'View Leads Pipeline', url: '/leads' }
      };
    }

    setHistory((prev) => [newAnswer, ...prev]);
    setPrompt('');
    addToast({
      type: 'info',
      title: 'EstateFlow AI Response Generated',
      message: 'Verified database & document citations retrieved.'
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title Header */}
      <div className="pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          Internal Staff AI Assistant
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Ask questions about property inventory, lead scoring, appointment schedules & workflow diagnostics
        </p>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="space-y-2">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Suggested Prompts</div>
        <div className="flex flex-wrap gap-2">
          {suggestedPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500 dark:hover:border-purple-500 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-sm transition-all text-left"
            >
              "{p}"
            </button>
          ))}
        </div>
      </div>

      {/* Prompt Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md flex items-center gap-2"
      >
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask EstateFlow AI about leads, properties, schedules, or automation failures..."
          className="flex-1 px-3 py-2 bg-transparent text-sm text-slate-900 dark:text-slate-100 outline-none"
        />
        <button
          type="submit"
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow"
        >
          <Send className="w-4 h-4" />
          <span>Ask AI</span>
        </button>
      </form>

      {/* Structured Answer Cards History */}
      <div className="space-y-6">
        {history.map((item, index) => (
          <div
            key={index}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
          >
            {/* Staff Question */}
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100 pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center text-xs">
                Q
              </span>
              <span>{item.question}</span>
            </div>

            {/* Answer Structure Breakdown (CRITICAL REQUIREMENT: Distinguish Verified facts vs Document Info vs AI Summary vs Suggested Action) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Section 1: Verified Database Facts */}
              <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 space-y-2">
                <h4 className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-emerald-600" /> 1. Verified Database Facts
                </h4>
                <ul className="space-y-1 text-slate-700 dark:text-slate-300 list-disc list-inside">
                  {item.verifiedFacts.map((fact, i) => (
                    <li key={i}>{fact}</li>
                  ))}
                </ul>
              </div>

              {/* Section 2: Retrieved Document Info */}
              {item.retrievedDocInfo && (
                <div className="p-4 rounded-xl bg-sky-50/70 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/80 space-y-2">
                  <h4 className="font-bold text-sky-900 dark:text-sky-200 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-sky-600" /> 2. Retrieved Document Information
                  </h4>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{item.retrievedDocInfo}</p>
                </div>
              )}

              {/* Section 3: AI-Generated Summary */}
              <div className="p-4 rounded-xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/80 space-y-2">
                <h4 className="font-bold text-purple-900 dark:text-purple-200 flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-purple-600" /> 3. AI-Generated Synthesis
                </h4>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{item.aiSummary}</p>
              </div>

              {/* Section 4: Suggested Action & Links */}
              <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 space-y-2">
                <h4 className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" /> 4. Recommended Next Action
                </h4>
                <p className="text-slate-700 dark:text-slate-300 font-semibold">{item.suggestedAction}</p>

                {item.relatedRecordLink && (
                  <div className="pt-2">
                    <Link
                      href={item.relatedRecordLink.url}
                      className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline"
                    >
                      {item.relatedRecordLink.label} &rarr;
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
