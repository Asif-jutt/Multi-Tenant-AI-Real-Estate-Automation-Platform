'use client';

import React, { useState } from 'react';
import { Building2, ChevronDown, Check, Plus, Shield } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const WorkspaceSwitcher: React.FC = () => {
  const { organization, setOrganization, user, setIsAuthModalOpen, setAuthViewTab, addToast } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  // Fictional multi-tenant workspace list for user
  const availableWorkspaces = [
    { id: organization.id, name: organization.name, role: user.role, active: true },
    { id: 'org-royal-002', name: 'Royal Properties Ltd', role: 'agent', active: false },
    { id: 'org-apex-003', name: 'Apex Commercial Capital', role: 'read_only', active: false }
  ];

  const handleSwitch = (ws: typeof availableWorkspaces[0]) => {
    if (ws.id === organization.id) {
      setIsOpen(false);
      return;
    }

    setOrganization({
      id: ws.id,
      name: ws.name,
      type: 'residential_sales',
      primaryLanguage: 'en_ur',
      country: 'Pakistan',
      memberCount: 8
    });

    addToast({
      type: 'info',
      title: 'Workspace Switched',
      message: `Switched active header context to '${ws.name}' as '${ws.role}'.`
    });

    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between hover:bg-slate-800 transition-colors text-left"
        title="Switch Active Workspace"
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <Building2 className="w-4 h-4 text-purple-400 shrink-0" />
          <div className="truncate">
            <div className="text-xs font-semibold text-white truncate">{organization.name}</div>
            <div className="text-[10px] text-slate-400 capitalize truncate">{user.role.replace('_', ' ')} Role</div>
          </div>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 p-2 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-1 animate-in fade-in duration-150">
          <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
            <span>Authorized Workspaces</span>
            <Shield className="w-3 h-3 text-purple-400" />
          </div>

          {availableWorkspaces.map((ws) => (
            <button
              key={ws.id}
              onClick={() => handleSwitch(ws)}
              className={`w-full p-2 rounded-xl flex items-center justify-between text-left text-xs transition-colors ${
                ws.id === organization.id ? 'bg-purple-950/60 text-white border border-purple-800' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <div className="truncate">
                <div className="font-semibold truncate">{ws.name}</div>
                <div className="text-[10px] text-slate-400 capitalize">{ws.role.replace('_', ' ')}</div>
              </div>
              {ws.id === organization.id && <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" />}
            </button>
          ))}

          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={() => {
                setIsOpen(false);
                setAuthViewTab('register');
                setIsAuthModalOpen(true);
              }}
              className="w-full p-2 rounded-xl text-xs font-semibold text-purple-400 hover:bg-purple-950/40 flex items-center gap-2 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Organization</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
