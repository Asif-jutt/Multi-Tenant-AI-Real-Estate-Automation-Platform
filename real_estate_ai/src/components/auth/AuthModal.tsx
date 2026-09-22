'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Sparkles, LogIn, UserPlus, Shield, User, Key, CheckCircle, LogOut, Building2, UserCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authViewTab,
    setAuthViewTab,
    loginUser,
    registerUser,
    logoutUser,
    user,
    setUser,
    addToast
  } = useApp();

  const router = useRouter();

  const [accountType, setAccountType] = useState<'customer' | 'agency'>('customer');
  const [email, setEmail] = useState('asifhussain5115@gmail.com');
  const [password, setPassword] = useState('11111111');
  const [orgName, setOrgName] = useState('EstateFlow Prime Real Estate');
  const [firstName, setFirstName] = useState('Asif');
  const [lastName, setLastName] = useState('Hussain');
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleFormLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (email === 'asifhussain5115@gmail.com' && password === '11111111') {
        await loginUser(email, password);
        router.push('/properties');
      } else {
        // Customer / Buyer Sign In
        setUser({
          id: 'cust-101',
          name: firstName && lastName ? `${firstName} ${lastName}` : 'Valued Buyer / Tenant',
          email: email,
          role: 'customer',
          organizationId: 'public',
          organizationName: 'Real Estate Buyer'
        });
        addToast({
          type: 'success',
          title: 'Buyer Sign In Successful',
          message: `Welcome to your customer portal, ${email}`
        });
        setIsAuthModalOpen(false);
        router.push('/customer/dashboard');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickCustomerLogin = () => {
    setUser({
      id: 'cust-101',
      name: 'Tariq Mahmood (Buyer)',
      email: 'tariq.buyer@gmail.com',
      role: 'customer',
      organizationId: 'public',
      organizationName: 'Private Real Estate Buyer'
    });
    addToast({
      type: 'success',
      title: 'Customer Buyer Sign-In',
      message: 'Redirecting to your personal Customer Requirements & Inquiries Dashboard...'
    });
    setIsAuthModalOpen(false);
    router.push('/customer/dashboard');
  };

  const handleFormRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (accountType === 'agency') {
        await registerUser({
          email,
          password,
          first_name: firstName,
          last_name: lastName,
          organization_name: orgName
        });
        router.push('/properties');
      } else {
        // Register Customer / Buyer Account
        setUser({
          id: `cust-${Date.now()}`,
          name: `${firstName} ${lastName}`.trim() || 'New Buyer',
          email: email,
          role: 'customer',
          organizationId: 'public',
          organizationName: 'Real Estate Buyer'
        });
        addToast({
          type: 'success',
          title: 'Customer Account Created',
          message: `Welcome, ${firstName}! You can now submit requirements and contact agencies.`
        });
        setIsAuthModalOpen(false);
        router.push('/customer/dashboard');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-100">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-900/40">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">EstateFlow AI Portal Access</h3>
              <p className="text-xs text-slate-400">Sign in or register as a Property Buyer/Tenant or Tenant Agency</p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 p-1.5 gap-1.5 text-xs font-semibold">
          <button
            onClick={() => setAuthViewTab('login')}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 transition-all ${
              authViewTab === 'login' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </button>

          <button
            onClick={() => setAuthViewTab('register')}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 transition-all ${
              authViewTab === 'register' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Account</span>
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Quick Demo Logins Bar */}
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Quick Account Presets:</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleQuickCustomerLogin}
                className="px-3 py-2 rounded-xl bg-purple-950/80 hover:bg-purple-900/90 text-purple-200 border border-purple-800/80 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
              >
                <UserCheck className="w-3.5 h-3.5 text-purple-400" />
                <span>Buyer / Customer Portal</span>
              </button>
              <button
                type="button"
                onClick={async () => {
                  await loginUser('asifhussain5115@gmail.com', '11111111');
                  router.push('/properties');
                }}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
              >
                <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Agency Admin Account</span>
              </button>
            </div>
          </div>

          {/* LOGIN FORM */}
          {authViewTab === 'login' && (
            <form onSubmit={handleFormLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs outline-none focus:border-purple-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-lg shadow-purple-900/40 transition-all disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>
          )}

          {/* REGISTER FORM */}
          {authViewTab === 'register' && (
            <form onSubmit={handleFormRegister} className="space-y-4">
              {/* Account Role Choice Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Account Role</label>
                <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setAccountType('customer')}
                    className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      accountType === 'customer' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Buyer / Client</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccountType('agency')}
                    className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      accountType === 'agency' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Agency Staff</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                    required
                  />
                </div>
              </div>

              {accountType === 'agency' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Agency / Organization Name</label>
                  <input
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-lg shadow-purple-900/40 transition-all disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : accountType === 'customer' ? 'Create Customer Buyer Account' : 'Create New Tenant Organization'}
              </button>
            </form>
          )}

          {/* Current Active Session & Logout Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-slate-400">
                Current: <strong className="text-white">{user.name}</strong> ({user.role})
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                logoutUser();
                setIsAuthModalOpen(false);
              }}
              className="px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

