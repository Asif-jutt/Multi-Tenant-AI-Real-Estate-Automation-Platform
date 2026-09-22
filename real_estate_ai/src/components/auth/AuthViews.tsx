'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Mail, Lock, Building, ArrowRight, ShieldCheck, CheckCircle2, User, Key, Globe } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../ui/Badge';

export const AuthViews: React.FC<{ defaultView?: 'login' | 'register' | 'forgot' | 'reset' | 'verify' | 'invite' | '2fa' | 'workspaces' }> = ({ defaultView = 'login' }) => {
  const { addToast } = useApp();
  const [activeTab, setActiveTab] = useState(defaultView);
  const [email, setEmail] = useState('tariq.mahmood@estateflow.ai');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addToast({
      type: 'success',
      title: 'Authentication Successful',
      message: `Signed in as ${email}`
    });
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col justify-center p-4 md:p-8">
      {/* View Switcher Bar for testing all 8 screens */}
      <div className="max-w-6xl w-full mx-auto mb-6 p-2 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between overflow-x-auto gap-2 text-xs">
        <div className="flex items-center gap-1">
          <span className="text-[10px] uppercase font-bold text-slate-500 px-2">Auth Screens:</span>
          {(['login', 'register', 'forgot', 'reset', 'verify', 'invite', '2fa', 'workspaces'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setActiveTab(v)}
              className={`px-3 py-1.5 rounded-xl font-semibold capitalize transition-all ${
                activeTab === v ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Auth Card Container */}
      <div className="max-w-5xl w-full mx-auto bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Side: Form Controls */}
        <div className="lg:col-span-7 p-8 md:p-12 flex flex-col justify-between space-y-6">
          <div>
            {/* Logo */}
            <div className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-900/40">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">EstateFlow AI</span>
            </div>

            {/* TAB 1: LOGIN */}
            {activeTab === 'login' && (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h2 className="text-2xl font-extrabold text-white">Welcome back</h2>
                  <p className="text-xs text-slate-400 mt-1">Sign in to manage agency properties, leads, and AI workflows.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Work Email</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs outline-none focus:border-purple-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-300">Password</label>
                      <button type="button" onClick={() => setActiveTab('forgot')} className="text-xs text-purple-400 hover:underline">
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs outline-none focus:border-purple-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded accent-purple-600"
                      />
                      Remember this device
                    </label>
                    <button type="button" onClick={() => setActiveTab('2fa')} className="text-slate-400 hover:text-white">
                      Enforce 2FA
                    </button>
                  </div>
                </div>

                <Link
                  href="/"
                  className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-900/30 transition-all"
                >
                  <span>Sign In to Agency Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="text-center text-xs text-slate-400">
                  Don't have an agency account?{' '}
                  <button type="button" onClick={() => setActiveTab('register')} className="text-purple-400 font-semibold hover:underline">
                    Register Organization
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: REGISTER */}
            {activeTab === 'register' && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-2xl font-extrabold text-white">Register Agency Organization</h2>
                  <p className="text-xs text-slate-400 mt-1">Start your 14-day free trial of EstateFlow AI.</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Agency Name</label>
                    <input
                      type="text"
                      defaultValue="Zameen Choice Real Estate"
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      defaultValue="Tariq Mahmood"
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Work Email</label>
                  <input
                    type="email"
                    defaultValue="tariq@zameenchoice.pk"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Country</label>
                    <input
                      type="text"
                      defaultValue="Pakistan"
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Default Language</label>
                    <select className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs">
                      <option>English + Urdu (en_ur)</option>
                      <option>English (en)</option>
                      <option>Urdu (ur)</option>
                    </select>
                  </div>
                </div>

                <Link
                  href="/onboarding"
                  className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg"
                >
                  Start Onboarding Wizard &rarr;
                </Link>
              </div>
            )}

            {/* TAB 3: FORGOT PASSWORD */}
            {activeTab === 'forgot' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-extrabold text-white">Reset Password</h2>
                <p className="text-xs text-slate-400">Enter your email and we'll send a password reset code.</p>
                <input
                  type="email"
                  defaultValue="tariq.mahmood@estateflow.ai"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                />
                <button
                  onClick={() => setActiveTab('reset')}
                  className="w-full py-3 rounded-xl bg-purple-600 text-white text-xs font-bold"
                >
                  Send Reset Link
                </button>
              </div>
            )}

            {/* TAB 4: RESET PASSWORD */}
            {activeTab === 'reset' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-extrabold text-white">Set New Password</h2>
                <input
                  type="password"
                  placeholder="New Password"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                />
                <button onClick={() => setActiveTab('login')} className="w-full py-3 rounded-xl bg-purple-600 text-white text-xs font-bold">
                  Update Password & Sign In
                </button>
              </div>
            )}

            {/* TAB 5: EMAIL VERIFY */}
            {activeTab === 'verify' && (
              <div className="space-y-4 text-center py-4">
                <ShieldCheck className="w-12 h-12 text-purple-400 mx-auto" />
                <h2 className="text-xl font-bold text-white">Verify Your Email</h2>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  We sent a 6-digit confirmation code to <span className="text-purple-400 font-semibold">tariq.mahmood@estateflow.ai</span>.
                </p>
                <div className="flex justify-center gap-2">
                  {['8', '4', '7', '2', '9', '1'].map((num, idx) => (
                    <input
                      key={idx}
                      type="text"
                      defaultValue={num}
                      className="w-10 h-12 text-center text-lg font-bold rounded-xl bg-slate-800 border border-slate-700 text-white"
                    />
                  ))}
                </div>
                <button onClick={() => setActiveTab('login')} className="w-full py-3 rounded-xl bg-purple-600 text-white text-xs font-bold">
                  Verify & Continue
                </button>
              </div>
            )}

            {/* TAB 6: INVITE ACCEPT */}
            {activeTab === 'invite' && (
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-800 text-xs text-purple-300">
                  You have been invited by <strong>Zameen Choice Real Estate</strong> as a Senior Sales Agent.
                </div>
                <h2 className="text-xl font-bold text-white">Accept Invitation</h2>
                <input
                  type="text"
                  defaultValue="Zainab Ahmed"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                />
                <button onClick={() => setActiveTab('login')} className="w-full py-3 rounded-xl bg-emerald-600 text-white text-xs font-bold">
                  Accept Invite & Join Team
                </button>
              </div>
            )}

            {/* TAB 7: 2FA */}
            {activeTab === '2fa' && (
              <div className="space-y-4 text-center py-4">
                <Key className="w-10 h-10 text-amber-400 mx-auto" />
                <h2 className="text-xl font-bold text-white">Two-Factor Authentication</h2>
                <p className="text-xs text-slate-400">Enter code from Authenticator App</p>
                <input
                  type="text"
                  placeholder="000 000"
                  className="w-48 text-center mx-auto block px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-lg tracking-widest font-mono"
                />
                <button onClick={() => setActiveTab('login')} className="w-full py-3 rounded-xl bg-purple-600 text-white text-xs font-bold">
                  Authenticate Session
                </button>
              </div>
            )}

            {/* TAB 8: WORKSPACE SELECTION */}
            {activeTab === 'workspaces' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-white">Select Agency Workspace</h2>
                <div className="space-y-2">
                  <div className="p-3.5 rounded-xl bg-purple-950/50 border border-purple-800 flex items-center justify-between cursor-pointer">
                    <div>
                      <h4 className="text-sm font-bold text-white">Zameen Choice Real Estate</h4>
                      <p className="text-xs text-slate-400">Lahore HQ • 14 Members</p>
                    </div>
                    <Badge variant="ai">Active</Badge>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700 flex items-center justify-between cursor-pointer hover:bg-slate-800">
                    <div>
                      <h4 className="text-sm font-bold text-white">Capital Properties Islamabad</h4>
                      <p className="text-xs text-slate-400">Blue Area Branch • 6 Members</p>
                    </div>
                    <span className="text-xs text-slate-500">Switch</span>
                  </div>
                </div>
                <Link href="/" className="block w-full text-center py-3 rounded-xl bg-purple-600 text-white text-xs font-bold">
                  Enter Selected Workspace
                </Link>
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-500 flex items-center gap-4 pt-4 border-t border-slate-800">
            <span>© 2026 EstateFlow AI</span>
            <span>Security & Privacy</span>
            <span>Terms of Service</span>
          </div>
        </div>

        {/* Right Side: Professional Property & AI Illustration Panel */}
        <div className="lg:col-span-5 bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 p-8 flex flex-col justify-between border-l border-slate-800 relative overflow-hidden">
          <div className="space-y-4 relative z-10">
            <Badge variant="ai">Verified Real-Estate AI</Badge>
            <h3 className="text-2xl font-black text-white leading-tight">
              Respond faster, recommend verified properties, and convert more inquiries into viewings.
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Designed specifically for multi-tenant property agencies in Pakistan & South Asia. Support for English & Urdu automated messaging with human approval controls.
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="space-y-2.5 relative z-10 text-xs">
            <div className="flex items-center gap-2 text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Verified Database Property RAG Search</span>
            </div>
            <div className="flex items-center gap-2 text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Urdu & English Voice/Text Processing</span>
            </div>
            <div className="flex items-center gap-2 text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Safety Approval Queue for Sensitive Actions</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
