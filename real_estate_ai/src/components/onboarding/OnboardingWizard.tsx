'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import { Badge } from '../ui/Badge';
import { CheckCircle2, Building, Globe, Home, Calendar, Mail, MessageSquare, Users, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

export const OnboardingWizard: React.FC = () => {
  const { addToast } = useApp();
  const [step, setStep] = useState(1);

  const [agencyName, setAgencyName] = useState('Zameen Choice Real Estate');
  const [agencyType, setAgencyType] = useState('residential_sales');
  const [languageConfig, setLanguageConfig] = useState('en_ur');

  const stepsList = [
    { num: 1, label: 'Workspace' },
    { num: 2, label: 'Agency Type' },
    { num: 3, label: 'Language' },
    { num: 4, label: 'First Property' },
    { num: 5, label: 'Calendar' },
    { num: 6, label: 'Email' },
    { num: 7, label: 'WhatsApp' },
    { num: 8, label: 'Team' },
    { num: 9, label: 'AI Preview' },
    { num: 10, label: 'Complete' }
  ];

  const handleNext = () => {
    if (step < 10) {
      setStep((prev) => prev + 1);
    } else {
      addToast({
        type: 'success',
        title: 'Setup Completed!',
        message: 'Your agency workspace is configured and ready.'
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 flex flex-col justify-between">
      {/* Top Header */}
      <div className="max-w-4xl w-full mx-auto flex items-center justify-between py-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-white text-base">EstateFlow AI Setup</span>
        </div>
        <button className="text-xs text-slate-400 hover:text-white">Save & Continue Later</button>
      </div>

      {/* Main Wizard Content Card */}
      <div className="max-w-4xl w-full mx-auto my-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl space-y-8">
        {/* Stepper Progress */}
        <div className="flex items-center justify-between overflow-x-auto pb-3 gap-2 border-b border-slate-800">
          {stepsList.map((s) => (
            <div key={s.num} className="flex items-center gap-1.5 shrink-0">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  s.num === step
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-900'
                    : s.num < step
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                {s.num < step ? <CheckCircle2 className="w-3.5 h-3.5" /> : s.num}
              </div>
              <span className={`text-xs font-semibold ${s.num === step ? 'text-white' : 'text-slate-500'}`}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* STEP 1: WORKSPACE */}
        {step === 1 && (
          <div className="space-y-4 max-w-xl">
            <Badge variant="ai">Step 1 of 10</Badge>
            <h2 className="text-2xl font-bold text-white">Create Agency Workspace</h2>
            <p className="text-xs text-slate-400">Name your multi-tenant real estate organization.</p>
            <input
              type="text"
              value={agencyName}
              onChange={(e) => setAgencyName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm outline-none focus:border-purple-500"
            />
          </div>
        )}

        {/* STEP 2: AGENCY TYPE */}
        {step === 2 && (
          <div className="space-y-4">
            <Badge variant="ai">Step 2 of 10</Badge>
            <h2 className="text-2xl font-bold text-white">Choose Agency Primary Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { id: 'residential_sales', name: 'Residential Sales', desc: 'Houses, Villas, Apartments for sale' },
                { id: 'rentals', name: 'Rentals & Property Management', desc: 'Long-term residential and commercial leases' },
                { id: 'commercial', name: 'Commercial Real Estate', desc: 'Offices, Plazas, Industrial warehouses' },
                { id: 'real_estate_development', name: 'Real-Estate Developer', desc: 'New housing societies and high-rise projects' }
              ].map((item) => (
                <div
                  key={item.id}
                  onClick={() => setAgencyType(item.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    agencyType === item.id
                      ? 'bg-purple-950/60 border-purple-600 text-white shadow-lg'
                      : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <h4 className="text-sm font-bold">{item.name}</h4>
                  <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: LANGUAGE */}
        {step === 3 && (
          <div className="space-y-4 max-w-xl">
            <Badge variant="ai">Step 3 of 10</Badge>
            <h2 className="text-2xl font-bold text-white">Configure AI & Customer Language</h2>
            <p className="text-xs text-slate-400">Select language direction for automated WhatsApp messages & AI responses.</p>
            <div className="space-y-2">
              {[
                { id: 'en_ur', label: 'English + Urdu (Bilingual - Recommended)', desc: 'AI automatically detects English or Urdu script and responds in matching language.' },
                { id: 'en', label: 'English Only', desc: 'Standard English interface and AI messaging.' },
                { id: 'ur', label: 'Urdu Only (اردو)', desc: 'Full Urdu Nastaliq / Noto Arabic script support.' }
              ].map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => setLanguageConfig(opt.id)}
                  className={`p-4 rounded-2xl border cursor-pointer ${
                    languageConfig === opt.id ? 'bg-purple-950/60 border-purple-600 text-white' : 'bg-slate-800/60 border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="text-sm font-bold">{opt.label}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{opt.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: ADD FIRST PROPERTY */}
        {step === 4 && (
          <div className="space-y-4">
            <Badge variant="ai">Step 4 of 10</Badge>
            <h2 className="text-2xl font-bold text-white">Add Your First Property Listing</h2>
            <p className="text-xs text-slate-400">Enter sample property data so EstateFlow AI can begin RAG recommendations.</p>
            <div className="grid grid-cols-2 gap-3">
              <input type="text" defaultValue="Modern 3-Bedroom Luxury Apartment" className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs" />
              <input type="text" defaultValue="Gulberg III, Lahore" className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs" />
              <input type="text" defaultValue="24500000" className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs" placeholder="Price (PKR)" />
              <select className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs">
                <option>3 Bedrooms</option>
                <option>4 Bedrooms</option>
                <option>5 Bedrooms</option>
              </select>
            </div>
          </div>
        )}

        {/* STEP 5: CALENDAR */}
        {step === 5 && (
          <div className="space-y-4 max-w-xl">
            <Badge variant="ai">Step 5 of 10</Badge>
            <h2 className="text-2xl font-bold text-white">Connect Google Calendar</h2>
            <p className="text-xs text-slate-400">Allow AI to schedule property viewing appointments without double-booking.</p>
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-emerald-400" />
                <div>
                  <h4 className="text-sm font-bold text-white">Google Workspace Calendar</h4>
                  <p className="text-xs text-slate-400">Connected as tariq.mahmood@estateflow.ai</p>
                </div>
              </div>
              <Badge variant="success">Connected</Badge>
            </div>
          </div>
        )}

        {/* STEP 6: EMAIL */}
        {step === 6 && (
          <div className="space-y-4 max-w-xl">
            <Badge variant="ai">Step 6 of 10</Badge>
            <h2 className="text-2xl font-bold text-white">Connect Agency Email</h2>
            <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="w-6 h-6 text-purple-400" />
                <div>
                  <h4 className="text-sm font-bold text-white">Gmail / Outlook Sync</h4>
                  <p className="text-xs text-slate-400">Read inbound lead emails & send property brochures.</p>
                </div>
              </div>
              <button className="px-3 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-semibold">Connect Email</button>
            </div>
          </div>
        )}

        {/* STEP 7: WHATSAPP */}
        {step === 7 && (
          <div className="space-y-4 max-w-xl">
            <Badge variant="ai">Step 7 of 10</Badge>
            <h2 className="text-2xl font-bold text-white">Connect WhatsApp Business API</h2>
            <p className="text-xs text-slate-400">You can connect Meta Cloud API now or test with sample sandbox number.</p>
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-6 h-6 text-emerald-400" />
                <div>
                  <h4 className="text-sm font-bold text-white">WhatsApp Business (+92 300 8472910)</h4>
                  <p className="text-xs text-slate-400">Sandbox API ready for Urdu & English chat.</p>
                </div>
              </div>
              <Badge variant="success">Connected</Badge>
            </div>
          </div>
        )}

        {/* STEP 8: TEAM */}
        {step === 8 && (
          <div className="space-y-4 max-w-xl">
            <Badge variant="ai">Step 8 of 10</Badge>
            <h2 className="text-2xl font-bold text-white">Invite Agency Team Members</h2>
            <div className="space-y-2">
              <input type="email" defaultValue="zainab.ahmed@zameenchoice.pk" className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs" />
              <input type="email" defaultValue="hamza.malik@zameenchoice.pk" className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs" />
            </div>
          </div>
        )}

        {/* STEP 9: AI PREVIEW */}
        {step === 9 && (
          <div className="space-y-4 max-w-xl">
            <Badge variant="ai">Step 9 of 10</Badge>
            <h2 className="text-2xl font-bold text-white">Preview AI Assistant Behavior</h2>
            <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-800 text-xs space-y-2">
              <div className="font-bold text-purple-300">Default Confidence Threshold: 85%</div>
              <div className="text-slate-300">Any action involving booking appointments, price negotiations, or external messages will require agent approval.</div>
            </div>
          </div>
        )}

        {/* STEP 10: COMPLETE */}
        {step === 10 && (
          <div className="space-y-4 text-center py-6">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
            <h2 className="text-3xl font-extrabold text-white">Setup Complete!</h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Your agency workspace <strong>{agencyName}</strong> is ready for live lead capture, property RAG recommendations, and WhatsApp support.
            </p>
            <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-lg">
              <span>Go to Overview Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Bottom Navigation controls */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-800">
          <button
            onClick={() => setStep((prev) => Math.max(1, prev - 1))}
            disabled={step === 1}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-30"
          >
            <ArrowLeft className="w-4 h-4" /> Previous
          </button>

          {step < 10 && (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md"
            >
              <span>Continue &rarr;</span>
            </button>
          )}
        </div>
      </div>

      <div className="text-center text-xs text-slate-500 py-2">EstateFlow AI Agency Onboarding</div>
    </div>
  );
};
