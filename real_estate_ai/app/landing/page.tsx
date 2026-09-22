'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Building2,
  Users,
  Shield,
  FileText,
  CheckCircle2,
  ArrowRight,
  Globe,
  Lock,
  Layers,
  Search,
  Check
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-lg shadow-purple-900/40">
            <Sparkles className="w-5 h-5 fill-white/20" />
          </div>
          <div>
            <span className="text-xl font-black text-white tracking-tight">EstateFlow</span>
            <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800 font-bold uppercase">
              SaaS Platform
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#hierarchy" className="hover:text-white transition-colors">Architecture</a>
          <a href="#roles" className="hover:text-white transition-colors">Roles & Security</a>
          <Link href="/customer/properties" className="text-purple-400 hover:text-purple-300 flex items-center gap-1">
            <Search className="w-3.5 h-3.5" />
            <span>Public Marketplace</span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="px-4 py-2 rounded-xl border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 hover:bg-slate-900 transition-all"
          >
            Sign In
          </Link>

          <Link
            href="/"
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white shadow-lg shadow-purple-950/50 hover:shadow-purple-900/60 transition-all flex items-center gap-1.5"
          >
            <span>Register Organization</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 py-20 md:py-28 max-w-6xl mx-auto text-center space-y-8 overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-purple-600/15 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/60 border border-purple-800/80 text-purple-300 text-xs font-bold tracking-wide">
          <Building2 className="w-3.5 h-3.5 text-purple-400" />
          <span>Multi-Tenant Real Estate SaaS Platform</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
          International Multi-Tenant Operations Platform for Real Estate Agencies
        </h1>

        <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Manage agency properties, store verified deeds and documents, invite team members with tenant-scoped roles, switch workspaces seamlessly, and publish listings to public marketplaces.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-sm font-extrabold text-white shadow-xl shadow-purple-950/80 hover:shadow-purple-900/90 transition-all flex items-center justify-center gap-2"
          >
            <span>Start 14-Day Free Trial</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/customer/properties"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-sm font-bold text-slate-200 transition-all flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4 text-purple-400" />
            <span>Explore Public Listings</span>
          </Link>
        </div>

        {/* Feature Badges */}
        <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold text-slate-400 max-w-4xl mx-auto">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-3">
            <Lock className="w-5 h-5 text-emerald-400 shrink-0" />
            <div className="text-left">
              <div className="font-bold text-slate-200">Argon2 & PyJWT Security</div>
              <div className="text-[10px] text-slate-500">Token Rotation DB Revocation</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-3">
            <Layers className="w-5 h-5 text-purple-400 shrink-0" />
            <div className="text-left">
              <div className="font-bold text-slate-200">Multi-Org Workspace</div>
              <div className="text-[10px] text-slate-500">Seamless Header Switching</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-3">
            <Shield className="w-5 h-5 text-indigo-400 shrink-0" />
            <div className="text-left">
              <div className="font-bold text-slate-200">5-Tier Organization RBAC</div>
              <div className="text-[10px] text-slate-500">Owner, Manager, Editor, Agent</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-3">
            <FileText className="w-5 h-5 text-amber-400 shrink-0" />
            <div className="text-left">
              <div className="font-bold text-slate-200">Supabase Private Storage</div>
              <div className="text-[10px] text-slate-500">Short-Lived Signed URLs</div>
            </div>
          </div>
        </div>
      </section>

      {/* Multi-Tenant Hierarchy Section */}
      <section id="hierarchy" className="px-6 py-16 bg-slate-900/40 border-y border-slate-800/80">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
              Strict Multi-Tenant Hierarchy Architecture
            </h2>
            <p className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto">
              Users belong to one or more organizations with organization-scoped roles. Data, properties, legal documents, and audit logs are strictly isolated per organization.
            </p>
          </div>

          {/* Diagram Box */}
          <div className="p-6 md:p-8 rounded-3xl bg-slate-900 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto shadow-2xl">
            <pre className="leading-relaxed text-purple-300">
{`Platform (EstateFlow AI SaaS)
├── Organizations
│   ├── Organization A (e.g., Al-Rehman Real Estate)
│   │   ├── Members (Owner: Tariq, Manager: Zain, Editor: Sara)
│   │   ├── Properties (Villas, Apartments, Plots)
│   │   ├── Images & Private Documents (Title Deeds, NOCs)
│   │   └── Audit Logs (Tenant Mutation Trail)
│   │
│   ├── Organization B (e.g., Royal Properties)
│   │   ├── Members (Owner: Hamza)
│   │   ├── Properties
│   │   └── Audit Logs
│   │
│   └── Organization C
│       └── Workspace Isolated Data`}
            </pre>
          </div>
        </div>
      </section>

      {/* User Roles & Permissions Matrix */}
      <section id="roles" className="px-6 py-20 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
            Tenant-Scoped Organization Roles
          </h2>
          <p className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto">
            Roles are assigned per organization membership. A user can be an Owner in Org A and an Agent in Org B.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-purple-800/80 space-y-3">
            <div className="p-2 rounded-xl bg-purple-950 text-purple-300 w-max font-bold text-[10px] uppercase">
              Organization Owner
            </div>
            <h3 className="text-base font-bold text-white">Owner</h3>
            <p className="text-xs text-slate-400">Created on org registration. Full org profile, member invitations, publishing, settings & audit logs.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-indigo-800/80 space-y-3">
            <div className="p-2 rounded-xl bg-indigo-950 text-indigo-300 w-max font-bold text-[10px] uppercase">
              Organization Manager
            </div>
            <h3 className="text-base font-bold text-white">Manager</h3>
            <p className="text-xs text-slate-400">Manages team properties, creates/updates listings, publishes & archives properties, manages staff workflows.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="p-2 rounded-xl bg-slate-800 text-slate-300 w-max font-bold text-[10px] uppercase">
              Property Editor
            </div>
            <h3 className="text-base font-bold text-white">Property Editor</h3>
            <p className="text-xs text-slate-400">Creates & updates properties, uploads images and legal documents. Cannot publish without approval.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="p-2 rounded-xl bg-slate-800 text-slate-300 w-max font-bold text-[10px] uppercase">
              Agent
            </div>
            <h3 className="text-base font-bold text-white">Agent</h3>
            <p className="text-xs text-slate-400">Reads permitted property inventory, views published property information and assigned listings.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="p-2 rounded-xl bg-slate-800 text-slate-300 w-max font-bold text-[10px] uppercase">
              Read Only
            </div>
            <h3 className="text-base font-bold text-white">Read Only</h3>
            <p className="text-xs text-slate-400">Read-only view access. Cannot create, edit, delete, publish, or change settings.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto px-6 py-8 border-t border-slate-800/80 bg-slate-950 text-xs text-slate-500 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>© 2026 EstateFlow AI SaaS Platform. All rights reserved.</div>
        <div className="flex items-center gap-6">
          <Link href="/" className="hover:text-slate-300">Sign In</Link>
          <Link href="/customer/properties" className="hover:text-slate-300">Public Marketplace</Link>
          <a href="#hierarchy" className="hover:text-slate-300">Architecture</a>
        </div>
      </footer>
    </div>
  );
}
