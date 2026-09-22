'use client';

import React, { useState } from 'react';
import { CheckCircle2, Circle, ArrowRight, Building2, Home, Upload, UserPlus, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';

export const OnboardingChecklist: React.FC = () => {
  const { organization, properties, user, setIsAuthModalOpen, setAuthViewTab } = useApp();
  const [dismissed, setDismissed] = useState(false);

  // Check user role
  const isOwnerOrManager = ['organization_owner', 'organization_manager', 'owner', 'admin'].includes(user.role);
  if (!isOwnerOrManager || dismissed) return null;

  const hasProperties = properties.length > 0;
  const hasImagesOrDocs = properties.some((p) => p.images.length > 0);
  const completedCount = 1 + (hasProperties ? 1 : 0) + (hasImagesOrDocs ? 1 : 0);
  const totalSteps = 4;
  const progressPercent = Math.round((completedCount / totalSteps) * 100);

  return (
    <div className="p-5 md:p-6 rounded-3xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 border border-purple-800/60 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <span>Agency Onboarding Checklist</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-900 text-purple-200 border border-purple-700 font-bold">
                {progressPercent}% Complete
              </span>
            </h3>
            <p className="text-xs text-slate-300">Welcome to {organization.name}! Complete these steps to launch your workspace.</p>
          </div>
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          Dismiss
        </button>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      {/* Steps List */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-white flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-purple-400" />
              <span>1. Create Organization</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">{organization.name} provisioned</div>
          </div>
        </div>

        <Link
          href="/properties"
          className={`p-3 rounded-2xl border transition-all flex items-start gap-2.5 ${
            hasProperties
              ? 'bg-slate-900/80 border-slate-800'
              : 'bg-purple-950/40 border-purple-800 hover:bg-purple-900/40'
          }`}
        >
          {hasProperties ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <Circle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          )}
          <div>
            <div className="font-bold text-white flex items-center gap-1">
              <Home className="w-3.5 h-3.5 text-indigo-400" />
              <span>2. Add First Property</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {hasProperties ? `${properties.length} property listings created` : 'Create listing draft'}
            </div>
          </div>
        </Link>

        <Link
          href="/properties"
          className={`p-3 rounded-2xl border transition-all flex items-start gap-2.5 ${
            hasImagesOrDocs
              ? 'bg-slate-900/80 border-slate-800'
              : 'bg-indigo-950/40 border-indigo-800 hover:bg-indigo-900/40'
          }`}
        >
          {hasImagesOrDocs ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <Circle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          )}
          <div>
            <div className="font-bold text-white flex items-center gap-1">
              <Upload className="w-3.5 h-3.5 text-amber-400" />
              <span>3. Media & Documents</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Upload photos & title deeds</div>
          </div>
        </Link>

        <button
          onClick={() => {
            setAuthViewTab('register');
            setIsAuthModalOpen(true);
          }}
          className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 hover:bg-slate-800 text-left transition-all flex items-start gap-2.5"
        >
          <Circle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-white flex items-center gap-1">
              <UserPlus className="w-3.5 h-3.5 text-sky-400" />
              <span>4. Invite Team Members</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Assign tenant roles</div>
          </div>
        </button>
      </div>
    </div>
  );
};
