'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, Building2, ShieldCheck, ArrowRight, UserPlus, CheckCircle2, AlertCircle } from 'lucide-react';
import { EstateFlowApiService } from '../../../src/services/api';
import { useApp } from '../../../src/context/AppContext';

export default function InviteAcceptPage() {
  const params = useParams();
  const router = useRouter();
  const token = params?.token as string;
  const { addToast } = useApp();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [invitation, setInvitation] = useState<any>(null);
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    if (token) {
      fetchInviteDetails();
    }
  }, [token]);

  const fetchInviteDetails = async () => {
    setLoading(true);
    try {
      const data = await EstateFlowApiService.inspectInvitation(token);
      setInvitation(data);
    } catch (err: any) {
      setError(err.message || 'Invitation token is invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    setAccepting(true);
    try {
      const res = await EstateFlowApiService.acceptInvitation(token);
      addToast({
        type: 'success',
        title: 'Invitation Accepted',
        message: res.detail || 'Joined organization workspace successfully!'
      });
      router.push('/');
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Acceptance Failed',
        message: err.message || 'Error accepting invitation.'
      });
    } finally {
      setAccepting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-purple-900/40">
          <Sparkles className="w-6 h-6" />
        </div>

        <div>
          <h2 className="text-2xl font-black text-white">Team Invitation</h2>
          <p className="text-xs text-slate-400 mt-1">EstateFlow AI Multi-Tenant Workspace</p>
        </div>

        {loading && (
          <div className="py-8 text-xs text-slate-400 animate-pulse">
            Verifying invitation token...
          </div>
        )}

        {error && (
          <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs space-y-2">
            <AlertCircle className="w-6 h-6 mx-auto text-rose-400" />
            <div className="font-bold">{error}</div>
            <p className="text-[10px] text-slate-400">Ask your organization owner to resend the invitation link.</p>
            <Link href="/" className="inline-block mt-2 text-purple-400 hover:underline font-semibold">
              Return to App Overview &rarr;
            </Link>
          </div>
        )}

        {invitation && !loading && !error && (
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-purple-950/50 border border-purple-800 text-left space-y-2">
              <div className="flex items-center gap-2 text-purple-300 font-bold text-xs">
                <Building2 className="w-4 h-4 text-purple-400" />
                <span>{invitation.organization_name || 'Organization Workspace'}</span>
              </div>
              <div className="text-xs text-slate-300">
                You have been invited to join as <span className="font-bold text-white uppercase">{invitation.role}</span>.
              </div>
              <div className="text-[10px] text-slate-400">
                Invited Email: <span className="text-slate-200">{invitation.email}</span>
              </div>
            </div>

            <button
              onClick={handleAccept}
              disabled={accepting}
              className="w-full py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-lg shadow-purple-950/60 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {accepting ? (
                'Accepting Invitation...'
              ) : (
                <>
                  <span>Accept Invitation & Join Team</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
